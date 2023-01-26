/**
 * En este módulo se hace el procesamiento de errores a nivel de toda la aplicación.
 * 
 * Lo que se evita con esto es enviar la traza completa de los errores en la respuesta.
 * 
 */

const response = require('./response');

function errors (error, req, res, next) {
  // Este es un middleware para mandar mensajes de error mejorados al cliente
  // (se oculta la traza, se verifica el codigo de error, etc.)
  console.error('[Error]', error);

  const message = error.message || 'Error interno';
  const status = error.statusCode || 500;

  response.error(req, res, message, status);
}

module.exports = errors;