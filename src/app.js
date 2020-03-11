const express = require('express');

const testRouter = require('./routers/test');

const app = express();

app.use(testRouter);

module.exports = app;
