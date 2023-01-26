/**
 * En este modo se genera un middleware que es exportado para
 * verificar si un usuario tiene permisos para ejecutar ciertas
 * acciones en la aplicación.
 */

const auth = require('../../../auth');

module.exports = function checkAuth(action) {
  // Middleware que hace el check del token

  function middleware(req, res, next) {
    // Para ejecutar algunas acciones es necesario
    // recibir el ID del usuario a editar/eliminar, el cual
    // debe ir dentro del payload de la request bajo el nombre
    // "id".  Este se asigna a la variable "owner" la cual se
    // utiliza luego para hacer la verificación con el token JWT.
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
      case 'follow':
        auth.check.logged(req);
        next();
        break;
      case 'logged':
        auth.check.logged(req);
        next();
        break;
      default:
        next();
    }
  }

  return middleware;
}