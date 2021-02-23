const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.js');
const user = require('./components/user/network');

const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(bodyParser.json());

const swaggerDoc = require('./swagger.json');

// Definir las rutas
app.use('/api/user', user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Iniciar el servidor
app.listen(config.api.port, () => {
  console.log('API escuchando en puerto ', config.api.port);
});