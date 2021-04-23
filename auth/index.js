const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');

const secret = config.jwt.secret;

function sign(data) {
  return jwt.sign(data, secret);
}

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

function getToken(auth) {
  // La función descompone el encabezado Authorization y retorna únicamente el
  // token JWT.  El formato del header es 'Bearer asd...sfs.asdf...asdf.as...df'

  if (!auth) {
    throw error('No hay token', 401);
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw error('Mal token', 400);
  } 

  let token = auth.replace('Bearer ', '');

  return token;
}

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