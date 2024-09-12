import { DataTypes, fn } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { BaseEntity } from '../base.entity.js';

export class Categories extends BaseEntity {}

Categories.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  { sequelize, modelName: 'categories' }
);
