const controller = require('./controller');
const store = require('../../../store/dummy');

// Se inyecta el repositorio al controlador
module.exports = controller(store);