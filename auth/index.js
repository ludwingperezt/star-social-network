/**
 * Funciones auxiliares para generar y validar tokens JWT
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');

const secret = config.jwt.secret;

/**
 * Genera un token JWT
 * @param {string} data 
 * @returns 
 */
function sign(data) {
  return jwt.sign(data, secret);
}

/**
 * Verifica un token JWT
 * @param {boolean} token 
 * @returns 
 */
function verify(token) {
  return jwt.verify(token, secret)
}

const check = {
  own: function(req, owner) {
    const decodedToken = decodeHeader(req);
    console.log(decodedToken);

    // Comprobar si es o NO propio
    if (decodedToken.id !== owner) {
      throw error('Acceso denegado!', 403);
    }
  },
  logged: function(req) {
    const decodedToken = decodeHeader(req);
  }
}

/**
 * Extrae el token JWT del header de autorización recibido en la request.
 * @param {string} auth 
 * @returns {string} Retorna el token JWT
 */
function getToken(auth) {
  // La función descompone el encabezado Authorization y retorna únicamente el
  // token JWT.  El formato del header es 'Bearer asd...sfs.asdf...asdf.as...df'

  if (!auth) {
    throw error('No hay token', 401);
  }

  // Si la palabra Bearer no está en la cadena recibida, el token está malo.
  if (auth.indexOf('Bearer ') === -1) {
    throw error('Mal token', 400);
  } 

  let token = auth.replace('Bearer ', '');

  return token;
}

/**
 * De la request obtiene el header de autorización y de éste extrae la data
 * del token JWT.
 * 
 * @param {*} req 
 * @returns {object} Retorna los datos codificados en el token (payload)
 */
function decodeHeader(req) {
  // Procesa la request para obtener el usuario en base al token recibido
  const authorization = req.headers.authorization || '';
  const token = getToken(authorization);
  const decoded = verify(token);

  req.user = decoded;

  return decoded;
}

module.exports = {
  sign,
  check,
};