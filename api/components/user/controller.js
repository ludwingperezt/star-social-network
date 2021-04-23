const { nanoid } = require('nanoid');
const auth = require('../auth')

const TABLA = 'user';

module.exports = function (injectedStore) {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }
  
  function list () {
    return store.list(TABLA);
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
    return store.queryList(TABLA + '_follow', {
      user_from: id
    })
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