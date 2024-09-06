import { sequelize } from '../../common/data/sequelize.js';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';

export const liveness = controllerWrapper((_, res) => res.send('OK'));

export const readyness = controllerWrapper(async (_, res) => {
  await sequelize.query('SELECT 1');

  res.send('OK');
});
