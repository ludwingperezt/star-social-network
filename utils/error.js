/**
 * Genera un Error que puede ser personalizado según la necesidad,
 * así se evita enviar el error nativo del sistema (más por cuestiones de
 * seguridad).
 * 
 * @param {string} message 
 * @param {int} code 
 * @returns 
 */
function error(message, code) {

  let e = new Error(message);

  if (code) {
    e.statusCode = code;
  }

  return e;
}

module.exports = error;