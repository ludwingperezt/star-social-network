/**
 * Este es el archivo raíz de acceso al proyecto.  
 * 
 * Desde esta parte se llaman al resto de componentes de toda la aplicación.
 */
const express = require('express');
const bodyParser = require('body-parser');  // Esto permite trabajar datos con JSON
const config = require('../config.js');  // Archivo de configuración que va en la carpeta raíz del proyecto
const user = require('./components/user/network');
const auth = require('./components/auth/network');
const errors = require('../network/errors');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(bodyParser.json());

const swaggerDoc = require('./swagger.json');
const { response } = require('express');

// Definir las rutas
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// El tratamiento de los mensajes de error será el último middleware que se le
// pasará a express.
// SIEMPRE DEBE SER EL ULTIMO MIDDLEWARE.
// Este middleware se usa para los errores no controlados provenientes de cualquier
// parte del código
app.use(errors);

// Iniciar el servidor
app.listen(config.api.port, () => {
  console.log('API escuchando en puerto ', config.api.port);
});