import { sequelize } from '../../common/data/sequelize.js';

export const liveness = (_, res) => res.send('OK');

export const readyness = async (_, res) => {
  await sequelize.query('SELECT 1');

  res.send('OK');
};
