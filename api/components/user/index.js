const controller = require('./controller');
//const store = require('../../../store/postgres');
const store = require('../../../store/remote-postgres');

// Se inyecta el repositorio al controlador
module.exports = controller(store);