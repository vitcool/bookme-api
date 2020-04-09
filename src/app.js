const express = require('express');
const cors = require('cors');

require('./db/mongoose');

const testRouter = require('./routers/test');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(cors());

app.use(express.json());
app.use(testRouter);
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
