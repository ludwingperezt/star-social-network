// Archivo del repositorio

const db = {
  'user': [
    {id: '1', name: 'Ludwing'}
  ]
};

async function list (tabla) {
  return db[tabla] || [];
}

async function get (tabla, id) {
  let coleccion = await list(tabla);
  return coleccion.filter(item => item.id === id)[0] || null;
}

async function upsert (tabla, data) {
  if (!db[tabla]) {
    db[tabla] = [];
  }
  db[tabla].push(data);

  // console.log(db)
  return data
}

async function remove(tabla, id) {
  return true;
}

async function query(tabla, q) {
  let coleccion = await list(tabla);
  let keys = Object.keys(q);
  let key = keys[0];

  return coleccion.filter(item => item[key] === q[key])[0] || null;
}

module.exports = {
  list,
  get,
  upsert,
  remove,
  query
};