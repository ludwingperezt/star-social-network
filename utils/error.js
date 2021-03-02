function error(message, code) {
  // Esta función genera un Error que puede ser personalizado según la necesidad
  // así se evita enviar el error nativo del sistema (más por cuestiones de
  // seguridad).
  let e = new Error(message);

  if (code) {
    e.statusCode = code;
  }

  return e;
}

module.exports = error;