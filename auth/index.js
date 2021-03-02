const jwt = require('jsonwebtoken');
const config = require('../config');

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
      throw new Error('Acceso denegado!');
    }
  }
}

function getToken(auth) {
  // La función descompone el encabezado Authorization y retorna únicamente el
  // token JWT.  El formato del header es 'Bearer asd...sfs.asdf...asdf.as...df'

  if (!auth) {
    throw new Error('No viene token');
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw new Error('Formato inválido');
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