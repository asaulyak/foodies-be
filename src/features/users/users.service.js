import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserSubscriptions } from '../../common/data/entities/user-subscriptions/user-subscriptions.entity.js';
import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { uploadAvatar, deleteAvatar } from '../../common/helpers/cloudinary.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
import { commonRecipeInclude } from '../../common/data/entities/recipes/constants.js';
import { signToken } from '../../common/auth/auth.service.js';
import { paginationWrapper } from '../../common/data/pagination.wrapper.js';
import { sequelize } from '../../common/data/sequelize.js';

export const getUserByEmail = email => {
  return Users.findOne({
    where: {
      email
    }
  });
};

export const createUser = async ({ password, email, name }) => {
  const avatar = gravatar.url();

  const hashedPassword = await new Promise((resolve, reject) =>
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return reject(error);
      }

      bcrypt.hash(password, salt, (hashError, hash) => {
        if (error) {
          return reject(error);
        }

        return resolve(hash);
      });
    })
  );

  return Users.create({
    email,
    password: hashedPassword,
    avatar,
    name
  });
};

export const comparePassword = async function (email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (compareError, result) => {
      if (compareError) {
        return reject(compareError);
      }

      if (result) {
        return resolve(user);
      }

      return resolve(null);
    });
  });
};

export const getUserById = async id => {
  return Users.findByPk(id);
};

export const updateUserById = async (id, data) => {
  return Users.update(data, {
    where: {
      id
    }
  });
};

export const listFollowers = async ({ userId, page, limit, offset }) => {
  // Get the total count of followers
  const totalFollowersCount = await UserSubscriptions.count({
    where: {
      subscribedTo: userId // Count followers of the current user
    }
  });

  const followers = await UserSubscriptions.findAll({
    where: {
      subscribedTo: userId // Find users who follow the current user
    },
    include: [
      {
        model: Users,
        as: 'follower',
        attributes: ['id', 'name', 'avatar'], // Select desired user attributes
        include: [
          {
            model: Recipes,
            as: 'recipes', // Include recipes created by each follower
            attributes: ['id', 'thumb'], // Select desired recipe attributes
            limit: 4, // Limit to the last 4 recipes
            order: [['createdAt', 'DESC']] // Order by creation date (newest first)
          }
        ]
      }
    ],
    limit,
    offset
  });

  const followersIds = followers.map(follower => follower.ownerId);

  const userRecipesStats = await Users.findAll({
    attributes: ['id', [sequelize.fn('count', sequelize.col('recipes.id')), 'ownsRecipes']],
    include: [
      {
        model: Recipes,
        as: 'recipes',
        attributes: []
      }
    ],
    where: {
      id: followersIds
    },
    group: ['users.id']
  });

  const userRecipesStatsMap = userRecipesStats.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.dataValues.ownsRecipes }),
    {}
  );

  // Format results to include followers with recipes
  const followersWithRecipes = followers.map(follower => ({
    id: follower.follower.id,
    name: follower.follower.name,
    avatar: follower.follower.avatar,
    ownsRecipes: userRecipesStatsMap[follower.follower.id],
    recipes: follower.follower.recipes
  }));

  return {
    data: followersWithRecipes,
    total: totalFollowersCount,
    page,
    limit,
    offset
  };
};

export const listFollowing = async ({ currentUserId, page, limit, offset }) => {
  // Get the total count of following
  const totalFollowingsCount = await UserSubscriptions.count({
    where: {
      ownerId: currentUserId // Count following of the current user
    }
  });

  const following = await UserSubscriptions.findAll({
    where: {
      ownerId: currentUserId // Find users that the current user is following
    },
    include: [
      {
        model: Users,
        as: 'following',
        attributes: ['id', 'name', 'avatar'], // Select desired user attributes
        include: [
          {
            model: Recipes,
            as: 'recipes', // Include recipes created by each following
            attributes: ['id', 'thumb'], // Select desired recipe attributes
            limit: 4, // Limit to the last 4 recipes
            order: [['createdAt', 'DESC']] // Order by creation date (newest first)
          }
        ]
      }
    ],
    limit,
    offset
  });

  const followingIds = following.map(follower => follower.subscribedTo);

  const userRecipesStats = await Users.findAll({
    attributes: ['id', [sequelize.fn('count', sequelize.col('recipes.id')), 'ownsRecipes']],
    include: [
      {
        model: Recipes,
        as: 'recipes',
        attributes: []
      }
    ],
    where: {
      id: followingIds
    },
    group: ['users.id']
  });

  const userRecipesStatsMap = userRecipesStats.reduce(
    (acc, item) => ({ ...acc, [item.id]: item.dataValues.ownsRecipes }),
    {}
  );

  // Format results to include followers with recipes
  const followingsWithRecipes = following.map(following => ({
    id: following.following.id,
    name: following.following.name,
    avatar: following.following.avatar,
    ownsRecipes: userRecipesStatsMap[following.following.id],
    recipes: following.following.recipes
  }));

  return {
    data: followingsWithRecipes,
    total: totalFollowingsCount,
    page,
    limit,
    offset
  };
};

export const updateUserAvatar = async (userId, prevAvatar, tempFilePath) => {
  const { secure_url: avatar } = await uploadAvatar(tempFilePath);
  if (prevAvatar) {
    await deleteAvatar(prevAvatar);
  }

  try {
    // Delete file from device after uploading
    await fs.unlink(tempFilePath);
  } catch (err) {
    console.error(`Error deleting previous avatar file: ${err.message}`);
  }

  await updateUserById(userId, { avatar });

  return avatar;
};

export const getDetailedInfo = async (userId, searchId) => {
  const userData = await Users.findByPk(searchId, {
    attributes: ['id', 'avatar', 'name', 'email']
  });

  if (!userData) {
    return userData;
  } // Return null if user not found

  if (userId === searchId) {
    const [totalRecipesCount, totalFavoritesRecipesCount, totalFollowersCount, totalFollowingsCount] =
      await Promise.all([
        Recipes.count({
          where: {
            ownerId: searchId
          }
        }),
        UserFavorites.count({
          where: {
            ownerId: searchId
          }
        }),
        UserSubscriptions.count({
          where: {
            subscribedTo: searchId
          }
        }),
        UserSubscriptions.count({
          where: {
            ownerId: searchId
          }
        })
      ]);

    return {
      ...userData.dataValues,
      totalRecipes: totalRecipesCount,
      totalFavoritesRecipes: totalFavoritesRecipesCount,
      totalFollowers: totalFollowersCount,
      totalFollowings: totalFollowingsCount
    };
  }

  const [totalRecipesCount, totalFollowersCount] = await Promise.all([
    Recipes.count({
      where: {
        ownerId: searchId
      }
    }),

    UserSubscriptions.count({
      where: {
        subscribedTo: searchId
      }
    })
  ]);

  return {
    ...userData.dataValues,
    totalRecipes: totalRecipesCount,
    totalFollowers: totalFollowersCount
  };
};

export const getUserSubscription = async ({ currentUserId, subscribedTo }) => {
  return await UserSubscriptions.findOne({
    where: {
      ownerId: currentUserId,
      subscribedTo: subscribedTo
    }
  });
};

export const addUserSubscription = async ({ currentUserId, subscribedTo }) => {
  return await UserSubscriptions.create({
    ownerId: currentUserId,
    subscribedTo: subscribedTo
  });
};

export const removeUserSubscriptions = async ({ currentUserId, subscribedTo }) => {
  return await UserSubscriptions.destroy({
    where: {
      ownerId: currentUserId,
      subscribedTo: subscribedTo
    }
  });
};

export const listFavorites = async ({ ownerId, limit, offset, page }) => {
  const userFavorites = await UserFavorites.findAll({
    where: {
      ownerId
    }
  });

  const recipeIds = userFavorites.map(fav => fav.recipeId);

  return paginationWrapper(() => Recipes, {
    where: {
      id: recipeIds
    },
    include: commonRecipeInclude,
    limit,
    offset,
    page
  });
};

export const signIn = async user => {
  const userData = {
    name: user.name,
    email: user.email,
    id: user.id
  };

  const token = signToken(userData);

  await updateUserById(user.id, {
    token
  });

  return { token, userData };
};

export const getCurrentUser = async id => {
  const user = await Users.findByPk(id, {
    attributes: ['id', 'name', 'avatar', 'email']
  });

  const favoriteRecipes = await UserFavorites.findAll({
    where: {
      ownerId: id
    },
    attributes: ['recipeId']
  });

  const followers = await UserSubscriptions.findAll({
    where: {
      subscribedTo: id
    },
    attributes: ['ownerId']
  });

  const following = await UserSubscriptions.findAll({
    where: {
      ownerId: id
    },
    attributes: ['subscribedTo']
  });

  return {
    ...user.dataValues,
    favoriteRecipes: favoriteRecipes.map(item => item.recipeId),
    followers: followers.map(item => item.ownerId),
    following: following.map(item => item.subscribedTo)
  };
};
