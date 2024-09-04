import { emailRegexp } from '../../../auth/auth.constants.js';
import { DataTypes, fn } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { BaseEntity } from '../base.entity.js';

export class Users extends BaseEntity {}

Users.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail(value) {
          if (!emailRegexp.test(value)) {
            throw new Error('Email not validate');
          }
        }
      }
    },
    token: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  { sequelize, modelName: 'users' }
);
