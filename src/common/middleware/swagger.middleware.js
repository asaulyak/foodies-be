import * as path from 'node:path';
import swaggerUI from 'swagger-ui-express';
import { HttpError } from '../errors/http-error.js';
import Yaml from 'yamljs';

const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'openapi.yaml');

export const swaggerDocs = () => {
  try {
    const swaggerDoc = Yaml.load(SWAGGER_PATH);
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    return (req, res, next) => next(HttpError(500, "Can't load swagger docs"));
  }
};
