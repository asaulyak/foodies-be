import { DataTypes, fn, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Users } from '../users/users.entity.js';
import { Recipes } from '../recipes/recipes.entity.js';

export class UserSubscriptions extends Model {}

UserSubscriptions.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    subscribedTo: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    }
  },
  { sequelize, modelName: 'userSubscriptions' }
);

UserSubscriptions.belongsTo(Users, { foreignKey: 'ownerId', as: 'Follower' });
UserSubscriptions.belongsTo(Users, { foreignKey: 'subscribedTo', as: 'Following' });

Users.hasMany(UserSubscriptions, { foreignKey: 'ownerId', as: 'Subscriptions' });
Users.hasMany(UserSubscriptions, { foreignKey: 'subscribedTo', as: 'Followers' });

Recipes.belongsTo(Users, { foreignKey: 'ownerId', as: 'Author' });
Users.hasMany(Recipes, { foreignKey: 'ownerId', as: 'Recipes' });
