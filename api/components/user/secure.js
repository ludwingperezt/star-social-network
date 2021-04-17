// exportar un middleware
const auth = require('../../../auth');

module.exports = function checkAuth(action) {
  // Middleware que hace el check del token

  function middleware(req, res, next) {
    switch(action) {
      case 'update':
        // lógica
        const owner = req.params.id || req.body.id;
        auth.check.own(req, owner);
        next();
        break;
      case 'delete':
        const owner1 = req.params.id;
        auth.check.own(req, owner1);
        next();
        break;
      default:
        next();
    }
  }

  return middleware;
}