import { User } from '../../common/data/entities/user/user.entity.js';
import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import { ENV_CONFIG } from '../../common/config/index.js';
import jwt from 'jsonwebtoken';

export const getUserByEmail = email => {
  return User.findOne({
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

  return User.create({
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
  return User.update(data, {
    where: {
      id
    }
  });
};
