import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';

export class Ingredients extends Model {}

Ingredients.init(
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
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  { sequelize, modelName: 'ingredients' }
);
