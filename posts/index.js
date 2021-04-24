/**
 * El microservicio de post se enciende así:
 * nodemon posts/index.js
 */
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.js');
const posts = require('./components/post/network');
const errors = require('../network/errors');

const app = express();

app.use(bodyParser.json());

const { response } = require('express');

// Definir las rutas
app.use('/api/post', posts);

// El tratamiento de los mensajes de error será el último middleware que se le
// pasará a express.
// SIEMPRE DEBE SER EL ULTIMO MIDDLEWARE.
// Este middleware se usa para los errores no controlados provenientes de cualquier
// parte del código
app.use(errors);

// Iniciar el servidor
app.listen(config.post.port, () => {
  console.log('API Posts escuchando en puerto ', config.post.port);
});