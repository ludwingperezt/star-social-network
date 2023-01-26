/**
 * En este archivo se hace la exportación del controlador para poder 
 * inyectar el componente de almacenamiento.
 */

const config = require('../../../config');
const controller = require('./controller');

// En este punto mediante variables de entorno se puede
// determinar qué tipo de acceso a la base de datos se utiliza.
// Si en la configuración se pone que remoteDB sea false, entonces el acceso
// a la db será a través del componente de la base de datos.
// Si esa variable es true, entonces el acceso a la db se haría a través del
// microservicio API de acceso a la base de datos.
let store;
if (config.remoteDB === true) {
    store = require('../../../store/postgres');    
}
else {
    store = require('../../../store/remote-postgres');
}

// Se inyecta el repositorio al controlador
module.exports = controller(store);