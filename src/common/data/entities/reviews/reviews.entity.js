import { DataTypes, fn } from 'sequelize';
import { BaseEntity } from '../base.entity.js';
import { sequelize } from '../../sequelize.js';
import { Users } from '../users/users.entity.js';

export class Reviews extends BaseEntity {}

Reviews.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: fn('uuid_generate_v4'),
      allowNull: false,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    testimonial: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'testimonials'
  }
);

Reviews.belongsTo(Users, {
  foreignKey: 'ownerId'
});
