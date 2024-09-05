import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Users } from '../users/users.entity.js';
import { Recipes } from '../recipes/recipes.entity.js';

export class UserSubscriptions extends Model {}

UserSubscriptions.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    subscribedTo: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  },
  { sequelize, modelName: 'userSubscriptions' }
);

UserSubscriptions.belongsTo(Users, { foreignKey: 'ownerId', as: 'follower' });
UserSubscriptions.belongsTo(Users, { foreignKey: 'subscribedTo', as: 'following' });

Users.hasMany(UserSubscriptions, { foreignKey: 'ownerId', as: 'subscriptions' });
Users.hasMany(UserSubscriptions, { foreignKey: 'subscribedTo', as: 'followers' });

Recipes.belongsTo(Users, { foreignKey: 'ownerId', as: 'author' });
Users.hasMany(Recipes, { foreignKey: 'ownerId', as: 'recipes' });
