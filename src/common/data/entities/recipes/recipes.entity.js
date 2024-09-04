import { DataTypes, fn } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Areas } from '../areas/areas.entity.js';
import { Users } from '../users/users.entity.js';
import { Categories } from '../category/categories.entity.js';
import { Ingredients } from '../ingredients/ingredients.entity.js';
import { BaseEntity } from '../base.entity.js';

export class Recipes extends BaseEntity {}

Recipes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumb: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    areaId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  { sequelize, modelName: 'recipes' }
);

Recipes.belongsTo(Areas, {
  foreignKey: 'areaId'
});

Recipes.belongsTo(Users, {
  foreignKey: 'ownerId'
});

Recipes.belongsTo(Categories, {
  foreignKey: 'categoryId'
});

Recipes.belongsToMany(Ingredients, { through: 'recipeIngredients' });
