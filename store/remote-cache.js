/**
 * Creación de la instancia de servicio de acceso a la API de caché
 */
const remote = require('./remote');
const config = require('../config');

module.exports = new remote(config.cacheService.host, config.cacheService.port);