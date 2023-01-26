const { nanoid } = require('nanoid');  // Nanoid genera IDs
const auth = require('../auth')

const TABLA = 'user';

module.exports = function (injectedStore, injectedCache) {
  let cache = injectedCache;
  let store = injectedStore;

  // Si no se recibe un repositorio inyectado, entonces por defecto se toma
  // el controlador dummy.
  if (!store) {
    store = require('../../../store/dummy');
  }

  if (!cache) {
    // este es solo un arreglo para tener una base de datos de cache por defecto.
    store = require('../../../store/dummy');
  }
  
  /**
   * Retorna la lista de usuarios en la base de datos.
   * 
   * En primer lugar busca en la caché. Si no están ahí los datos los busca en la
   * base de datos y luego los inserta en la caché para que estén disponibles.
   * 
   * @returns 
   */
  async function list () {
    let users = await cache.list(TABLA);

    if (!users) {
      console.log("Datos no estan en cache, ir a DB");
      users = await store.list(TABLA)
      cache.upsert(TABLA, users);
    }
    else {
      console.log("Datos encontrados en cache!");
    }
    return users;
  }

  function get (id) {
    return store.get(TABLA, id);
  }

  async function upsert(body) {
    const user = {
      name: body.name,
      username: body.username,
      email: body.email,
      phone: body.phone
    };

    if (body.id) {
      user.id = body.id;
    }
    else {
      user.id = nanoid();
    }

    if (body.password || body.username) {
      await auth.upsert({
        id: user.id,
        username: user.username,
        password: body.password,
      })
    }
    return store.upsert(TABLA, user);
  }

  async function insert(body) {
    const user = {
      name: body.name,
      username: body.username,
      email: body.email,
      phone: body.phone,
      id: nanoid()
    };

    if (body.password || body.username) {
      // la contraseña se guarda en una coleccion diferente
      await auth.insert({
        id: user.id,
        username: body.username,
        password: body.password,
      })
    }

    return store.insert(TABLA, user)
  }

  function update(id, body) {
    const user = {id}

    if (body.name) {
      user.name = body.name
    }

    // if (body.username) {
    //   user.username = body.username
    // }

    if (body.email) {
      user.email = body.email
    }

    if (body.phone) {
      user.phone = body.phone
    }

    return store.update(TABLA, id, user)
  }

  function remove(id) {
    auth.remove(id)
    return store.remove(TABLA, id)
  }

  function follow(from, to) {
    return store.insert(TABLA + '_follow', {
      user_from: from,
      user_to: to
    })
  }

  function followers(id) {
    const joins = [{
      type: 'INNER',
      table: TABLA,
      key: 'id',
      referenceTable: TABLA + '_follow',
      referenceKey: 'user_to'
    }];

    const fields = ['id', 'username', 'name', 'email', 'phone'];

    return store.queryList(TABLA + '_follow', {
      user_from: id
    }, fields, joins)
  }

  return {
    list,
    get,
    upsert,
    insert,
    update,
    remove,
    follow,
    followers
  };
};