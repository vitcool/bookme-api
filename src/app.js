const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

require('./db/mongoose');

const testRouter = require('./routers/test');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'BookMe API',
      description: 'BookMe API Information',
      contact: {
        name: 'Vitalii Kulyk',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['src/routers/*.js'],
};

const app = express();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());

app.use(express.json());
app.use(testRouter);
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
