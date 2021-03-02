const controller = require('./controller');
const store = require('../../../store/postgres');

// Se inyecta el repositorio al controlador
module.exports = controller(store);