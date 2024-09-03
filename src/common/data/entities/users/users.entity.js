import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';

export class Users extends Model {}

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
      unique: true
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
