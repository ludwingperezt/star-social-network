/**
 * Creación de la instancia de servicio de acceso a la API de la base de datos.
 */
const remote = require('./remote');
const config = require('../config');

module.exports = new remote(config.postgresService.host, config.postgresService.port);