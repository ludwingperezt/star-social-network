// Archivo del repositorio

const db = {
  'user': [
    {id: 1, name: 'Ludwing'}
  ]
};

function list (tabla) {
  return db[tabla];
}

function get (tabla, id) {
  let coleccion = list(tabla);
  return coleccion.filter(item => item.id === id)[0] || null;
}

function upsert (tabla, data) {
  db[tabla].push(data);
}

function remove(tabla, id) {
  return true;
}

module.exports = {
  list,
  get,
  upsert,
  remove
};