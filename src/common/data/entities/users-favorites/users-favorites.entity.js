import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Users } from '../users/users.entity.js';
import { Recipes } from '../recipes/recipes.entity.js';
import { BaseEntity } from '../base.entity.js';

export class UserFavorites extends BaseEntity {}

UserFavorites.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: 'userFavorites'
  }
);

UserFavorites.belongsTo(Users, {
  foreignKey: 'ownerId',
  as: 'owner'
});

UserFavorites.belongsTo(Recipes, {
  foreignKey: 'recipeId',
  as: 'recipe'
});
