/**
 * Microservicio de datos: La base de datos es posible accederla a través
 * de este servicio que debería correr en el puerto 3001.
 * 
 * Para encender el servicio se debe hacer con el siguiente comando:
 * nodemon postgres/index.js
 * 
 * El archivo postgres/network.js contiene la definición de los endpoints 
 * expuestos por la API
 */
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