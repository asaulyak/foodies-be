import express from 'express';
import cors from 'cors';
import { sequelize } from './common/data/sequelize.js';
import { configEnvVars, ENV_CONFIG } from './common/config/index.js';
import { userRouter } from './features/users/users.routes.js';
import { healthRouter } from './features/health/health.routes.js';
import { recipesRouter } from './features/recipes/recipes.routes.js';
import { categoriesRouter } from './features/categories/categories.routes.js';
import { areasRouter } from './features/areas/areas.routes.js';
import { ingredientsRouter } from './features/ingredients/ingredients.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swagger.json' assert { type: 'json' };
configEnvVars();

const app = express();

// parse application/json
app.use(express.json());
// cors
app.use(cors());

// Add routes here
app.use('/api/users', userRouter);
app.use('/api/health', healthRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/areas', areasRouter);
app.use('/api/ingredients', ingredientsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Path not found',
    data: 'Not found'
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);

  const defaultMessage = 'Server error';

  const { status = 500, message = defaultMessage } = err;

  const isProd = ENV_CONFIG.NODE_ENV === 'prod';

  res.status(status).json({ message: isProd ? defaultMessage : message, status: 'fail', code: status });
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection successful');

    app.listen(ENV_CONFIG.PORT, function () {
      console.log(`Server running. Use our API on port: ${ENV_CONFIG.PORT}`);
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);

    process.exit(1);
  });
