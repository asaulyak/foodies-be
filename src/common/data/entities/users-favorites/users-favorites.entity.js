import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Users } from '../users/users.entity.js';
import { Recipes } from '../recipes/recipes.entity.js';

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
        as: 'recipes',
        key: 'id'
      },
      primaryKey: true
    }
  },
  { sequelize, modelName: 'userFavorites' }
);

UserFavorites.belongsTo(Recipes, { foreignKey: 'recipeId' });
