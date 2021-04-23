const { nanoid } = require('nanoid');

const TABLA = 'post';

module.exports = function (injectedStore) {
  let store = injectedStore;

  if (!store) {
    store = require('../../../store/dummy');
  }
  
  function list () {
    return store.list(TABLA);
  }

  function insert(body, userId) {
    const data = {
      id: nanoid(),
      title: body.title,
      post: body.post,
      user_id: userId
    }
    return store.insert(TABLA, data)
  }

  function get(id) {
    return store.get(TABLA, id);
  }

  function update(id, body) {
    const data = {id};

    if (body.title) {
      data.title = body.title
    }

    if (body.post) {
      data.post = body.post
    }

    return store.update(TABLA, id, data)
  }

  function remove(id) {
    return store.remove(TABLA, id)
  }

  return {
    list,
    insert,
    get,
    update,
    remove
  };
};