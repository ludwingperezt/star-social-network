/**
 * Microservicio cache: La caché con redis se ha creado como un microservicio
 * aparte.
 * 
 * El puerto por defecto es el 3003
 * 
 * Para encender el servicio se debe hacer con el siguiente comando:
 * nodemon postgres/index.js
 * 
 * El archivo cache/network.js contiene la definición de los endpoints 
 * expuestos por la API
 */
const express = require('express');
const bodyParser = require('body-parser');

const router = require('./network');

const config = require('../config');

const app = express();

app.use(bodyParser.json());

app.use('/', router)

app.listen(config.cacheService.port, () => {
  console.log('Cache-Redis Service listening ON port ', config.cacheService.port);
})