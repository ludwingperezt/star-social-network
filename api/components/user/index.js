/**
 * En este archivo se hace la exportación del controlador para poder 
 * inyectar el componente de almacenamiento.
 */

const controller = require('./controller');
//const store = require('../../../store/postgres');
const store = require('../../../store/remote-postgres');

// Se inyecta el repositorio al controlador
module.exports = controller(store);