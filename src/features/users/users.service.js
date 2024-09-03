import gravatar from 'gravatar';
import bcrypt from 'bcrypt';
import { Users } from '../../common/data/entities/users/users.entity.js';

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
