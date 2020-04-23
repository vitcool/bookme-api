const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

require('./db/mongoose');

const testRouter = require('./routers/test');
const authRouter = require('./routers/auth');
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'BookMe API',
      description: 'BookMe API Information',
      contact: {
        name: 'Vitalii Kulyk',
      },
      servers: ['http://localhost:3000'],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routers/*.js', 'src/models/*.js'],
};

const app = express();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());

app.use(express.json());
app.use(testRouter);
app.use(authRouter);
app.use(taskRouter);
app.use(userRouter);

module.exports = app;
