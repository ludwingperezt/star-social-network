/**
 * Base de datos falsa para pruebas.
 * 
 * Este componente simula una base de datos.
 */

// Archivo del repositorio
const error = require('../utils/error');

const db = {
  'user': [
    {id: '1', name: 'Ludwing Perez', email: 'ludwing@mail.com', phone: '+1 1234123409'}
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
  // Eliminar elemento de la tabla
  let coleccion = await list(tabla);
  let item = await get(tabla, id)

  if (item === null) {
    throw new error('No encontrado', 404)
  }
  
  const index = coleccion.indexOf(item)
  coleccion.splice(index, 1)
  
  return true;
}

async function query(tabla, q) {
  let coleccion = await list(tabla);
  let keys = Object.keys(q);
  let key = keys[0];

  return coleccion.filter(item => item[key] === q[key])[0] || null;
}

async function insert (tabla, data) {
  // Funcion de insercion de datoss
  if (!db[tabla]) {
    db[tabla] = [];
  }

  const userExist = await query(tabla, {username: data.username})
  
  if (userExist === null) {
    db[tabla].push(data);
    return data
  }
  
  throw new error('Usuario ya existe', 400)
}

async function update (tabla, id, data) {
  // Actualiza un elemento
  let item = await get(tabla, id)

  if (item === null) {
    throw new error('No encontrado', 404)
  }
  
  item = Object.assign(item, data)
  return item
}

module.exports = {
  list,
  get,
  upsert,
  remove,
  query,
  insert,
  update,
};