const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config');
const router = require('./network');

const app = express();

app.use(bodyParser.json());

app.use('/', router)

app.listen(config.postgresService.port, () => {
  console.log('Postgres Service listening in port ', config.postgresService.port);
})