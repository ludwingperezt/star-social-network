const express = require('express');
const config = require('../config.js');
const user = require('./components/user/network');

const app = express();

// Definir las rutas
app.use('/api/user', user)

// Iniciar el servidor
app.listen(config.api.port, () => {
  console.log('API escuchando en puerto ', config.api.port);
});