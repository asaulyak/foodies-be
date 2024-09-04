import jwt from 'jsonwebtoken';
import { ENV_CONFIG } from '../config/index.js';

const secret = ENV_CONFIG.JWT_SECRET;

export const signToken = payload =>
  jwt.sign({ iat: Math.floor(Date.now() / 1000), ...payload }, secret, { expiresIn: '1h' });

export const verifyToken = token => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
