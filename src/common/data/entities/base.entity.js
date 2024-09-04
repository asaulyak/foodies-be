import { Model } from 'sequelize';

export class BaseEntity extends Model {
  static init(attributes, options) {
    if (options.defaultScope === undefined) {
      options.defaultScope = {};
    }
    options.defaultScope.attributes = { exclude: ['createdAt', 'updatedAt'] };
    return super.init(attributes, options);
  }
}
