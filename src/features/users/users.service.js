import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserSubscriptions } from '../../common/data/entities/user-subscriptions/user-subscriptions.entity.js';
import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';

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

export const updateUserById = async (id, data) => {
  return Users.update(data, {
    where: {
      id
    }
  });
};

export const listFollowers = async ({ currentUserId } = {}, { page = 1, limit = 10 }) => {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
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
        as: 'Follower',
        attributes: ['id', 'name'], // Select desired user attributes
        include: [
          {
            model: Recipes,
            as: 'Recipes', // Include recipes created by each follower
            attributes: ['id', 'thumb'] // Select desired recipe attributes
          }
        ]
      }
    ],
    limit: normalizedLimit,
    offset
  });

  // Format results to include followers with recipes
  const followersWithRecipes = followers.map(follower => ({
    id: follower.Follower.id,
    name: follower.Follower.name,
    recipes: follower.Follower.Recipes
  }));

  return {
    followers: followersWithRecipes,
    totalFollowers: totalFollowersCount,
    page,
    limit
  };
};
