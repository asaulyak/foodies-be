import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserSubscriptions } from '../../common/data/entities/user-subscriptions/user-subscriptions.entity.js';
import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { getRecipeById } from '../recipes/recipes.service.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
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

export const listFollowers = async ({ currentUserId } = {}, { page, limit, offset }) => {
  // Get the total count of followers
  const totalFollowersCount = await UserSubscriptions.count({
    where: {
      subscribedTo: currentUserId // Count followers of the current user
    }
  });

  const followers = await UserSubscriptions.findAll({
    where: {
      subscribedTo: currentUserId // Find users who follow the current user
    },
    include: [
      {
        model: Users,
        as: 'follower',
        attributes: ['id', 'name'], // Select desired user attributes
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

  // Format results to include followers with recipes
  const followersWithRecipes = followers.map(follower => ({
    id: follower.follower.id,
    name: follower.follower.name,
    recipes: follower.follower.recipes
  }));

  return {
    followers: followersWithRecipes,
    totalFollowers: totalFollowersCount,
    page,
    limit
  };
};

export const listFollowing = async ({ currentUserId } = {}, { page, limit, offset }) => {
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
        attributes: ['id', 'name'], // Select desired user attributes
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

  // Format results to include followers with recipes
  const followingsWithRecipes = following.map(following => ({
    id: following.following.id,
    name: following.following.name,
    recipes: following.following.recipes
  }));

  return {
    following: followingsWithRecipes,
    totalFollowings: totalFollowingsCount,
    page,
    limit
  };
};

export const getDetailedInfo = async (userId, searchId) => {
  const userData = await Users.findByPk(searchId, {
    attributes: ['avatar', 'name', 'email']
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
