import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';

export class Areas extends Model {}

Areas.init(
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
    }
  },
  { sequelize, modelName: 'areas' }
);
