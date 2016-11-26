'use strict';

/* eslint-disable no-console */

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

/* Adding the middleware for exposing public library */
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.listen(PORT, () => {
  console.log(`Started application on port ${PORT}`);
});
