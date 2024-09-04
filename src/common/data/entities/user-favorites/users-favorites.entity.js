import { DataTypes, Model } from 'sequelize';
import { Users } from '../users/users.entity.js';
import { Recipes } from '../recipes/recipes.entity.js';
import { sequelize } from '../../sequelize.js';

export class UserFavorites extends Model {}

UserFavorites.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      references: {
        model: Users,
        key: 'id'
      },
      primaryKey: true
    },
    recipeId: {
      type: DataTypes.UUID,
      references: {
        model: Recipes,
        key: 'id'
      },
      primaryKey: true
    }
  },
  { sequelize, modelName: 'userFavorites' }
);
