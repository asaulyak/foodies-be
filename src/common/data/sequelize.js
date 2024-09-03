import { Sequelize } from 'sequelize';
import { ENV_CONFIG } from '../config/index.js';

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME, DB_PORT, NODE_ENV } = ENV_CONFIG;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  dialectOptions: {
    useNativeUUID: true,
    ssl: NODE_ENV === 'prod'
  },
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT
});
