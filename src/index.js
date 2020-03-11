/* eslint-disable no-console */
const express = require('express');

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Yeah, man! Server is up and running on port ${port}`);
});
