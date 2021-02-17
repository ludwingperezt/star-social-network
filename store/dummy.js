// Archivo del repositorio

const db = {
  'user': [
    {id: '1', name: 'Ludwing'}
  ]
};

async function list (tabla) {
  return db[tabla];
}

async function get (tabla, id) {
  let coleccion = await list(tabla);
  return coleccion.filter(item => item.id === id)[0] || null;
}

async function upsert (tabla, data) {
  db[tabla].push(data);
  return data
}

async function remove(tabla, id) {
  return true;
}

module.exports = {
  list,
  get,
  upsert,
  remove
};