import { config } from 'dotenv';

config();

const requiredEnvVariables = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET', 'PORT'];

export const ENV_CONFIG = {};

export const configEnvVars = () => {
  if (Object.keys(ENV_CONFIG).length) {
    return;
  }

  for (let varName of requiredEnvVariables) {
    const variable = process.env[varName];

    if (variable === undefined) {
      throw new Error(`Environment variable ${varName} not found`);
    }

    ENV_CONFIG[varName] = variable;
  }
};

(() => configEnvVars())();
