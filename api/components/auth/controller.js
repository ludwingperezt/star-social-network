/**
 * Funciones de manejo de tokens JWT.
 */
const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const TABLA = 'auth';

module.exports = function (injectedStore) {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }

  async function login(username, password) {
    const data = await store.query(TABLA, {username: username});

    return bcrypt.compare(password, data.password)
      .then(sonIguales => {
        if (sonIguales) {
          // Generar token
          return auth.sign(data)
        }
        else {
          throw new Error('Inválida');
        }
      });
  }

  async function upsert(data) {
    const authData = {
      id: data.id,
    }

    if (data.username) {
      authData.username = data.username;
    }

    if (data.password) {
      // El 5 es el salt del cifrado
      authData.password = await bcrypt.hash(data.password, 5);
    }

    return store.upsert(TABLA, authData);
  }

  async function insert(data) {
    // Insertar los datos de autenticacion: usuario y contraseña cifrada
    const authData = {
      id: data.id,
    }

    if (data.username) {
      authData.username = data.username;
    }

    if (data.password) {
      authData.password = await bcrypt.hash(data.password, 5);
    }

    return store.insert(TABLA, authData);
  }

  function remove(id) {
    // Elimina los datos de auth
    return store.remove(TABLA, id)
  }

  return {
    upsert,
    login,
    insert,
    remove
  }
}