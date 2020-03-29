const express = require('express');
const cors = require('cors');

require('./db/mongoose');

const testRouter = require('./routers/test');
const userRouter = require('./routers/user');

const app = express();

app.use(cors());

app.use(express.json());
app.use(testRouter);
app.use(userRouter);

module.exports = app;
