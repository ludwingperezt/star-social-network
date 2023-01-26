// Todas las respuestas se centralizan en este archivo: Se hace esto para
// que todas las respuestas sean estandar.

/**
 * Función que maneja las respuestas exitosas
 * @param {*} req 
 * @param {*} res 
 * @param {*} message - Mensaje o datos a retornar
 * @param {*} status - HTTP Status
 */
exports.success = function (req, res, message, status) {
  let statusCode = status || 200;
  let statusMessage = message || '';

  res.status(statusCode).send({
    error: false,
    status: statusCode,
    body: statusMessage
  }); 
}

/**
 * Función para manejo de errores a nivel de toda la aplicación
 * @param {*} req 
 * @param {*} res 
 * @param {*} message 
 * @param {*} status 
 */
exports.error = function (req, res, message, status) {
  let statusCode = status || 500;
  let statusMessage = message || 'Internal server error';

  res.status(statusCode).send({
    error: true,
    status: statusCode,
    body: statusMessage
  }); 
}