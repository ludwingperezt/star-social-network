/**
 * Crear un pool de conexión con postgres.
 * 
 * Fuentes:
 * https://node-postgres.com/features/pooling
 * https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
 */
const { Pool } = require('pg');
const config = require('../config');
const error = require('../utils/error');

const SCHEMA = config.postgres.schema;

const dbconf = {
  host: config.postgres.host,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  port: config.postgres.port,
};

const pool = new Pool(dbconf);

function handleCon(){
  // Función para gestionar la conexión con la base de datos
  pool.connect((err) => {
    if (err) {
      console.error('[ERROR]', err);
      setTimeout(handleCon, 2000);
    } else {
      console.log('DB Connected');
    }
  });
}

handleCon();

function list(table) {
  return pool.query(`SELECT * FROM ${SCHEMA}.${table}`)
    .then(res => {
      // Es necesario retornar una promesa que contenga solo el resultado de la
      // consulta, de lo contrario se retornará el objeto que contiene toda la 
      // consulta, la cual está formada por los datos en la tabla y otros 
      // adicionales.
      return res.rows;
    });
}

async function get (table, id) {
  return pool.query(`SELECT * FROM ${SCHEMA}.${table} WHERE id = $1`,[id])
    .then(res => {
      return (res.rowCount) ? res.rows[0] : null;
    });
}

async function remove(table, id) {
  // let item = await get(table, id)

  // if (item === null) {
  //   throw new error('No encontrado', 404)
  // }

  return pool.query(`DELETE FROM ${SCHEMA}.${table} WHERE id = $1`, [id]);
}

async function queryTable(table, q) {
  const elements = await queryList(table, q);

  return (elements.length) ? elements[0] : null;
}

async function insert (table, data) {
  const fieldsNames = Object.keys(data);
  let fields = fieldsNames.join(', ');
  const values = []
  const valuesRef = []

  // const userExist = await queryTable(table, {username: data.username})
  
  // if (userExist !== null) {
  //   throw new error('Usuario ya existe', 400)
  // }

  fieldsNames.forEach((item, index) => {
    values.push(data[item])
    valuesRef.push(`$${index + 1}`)
  })

  const valuesOrder = valuesRef.join(', ');

  const query = `INSERT INTO ${SCHEMA}.${table} (${fields}) VALUES (${valuesOrder}) RETURNING *`
  return pool
    .query(query, values)
    .then(res => {
      return res.rows[0];
    });
}

async function update (table, id, data) {
  const fieldsNames = Object.keys(data);
  const values = [id]
  const valuesRef = []
  let indice = 2 //El conteo empieza en 2 ya que el 1 pertenece al ID del elemento

  fieldsNames.forEach((item, index) => {
    if (item !== 'id') {
      valuesRef.push(`${item} = $${indice}`)  
      values.push(data[item])

      indice += 1
    }
  })

  const valuesOrder = valuesRef.join(', ');

  const query = `UPDATE ${SCHEMA}.${table} SET ${valuesOrder} WHERE id = $1 RETURNING *`

  return pool
    .query(query, values)
    .then(res => {
      return res.rows[0];
    });
}

async function queryList(table, q) {
  const fieldsNames = Object.keys(q);
  const values = []
  const valuesRef = []

  fieldsNames.forEach((item, index) => {
      valuesRef.push(`${item} = $${index + 1}`)
      values.push(q[item])
    })

  const valuesOrder = valuesRef.join(' AND ');

  const query = `SELECT * FROM ${SCHEMA}.${table} WHERE ${valuesOrder}`

  return pool
    .query(query, values)
    .then(res => {
      return (res.rowCount) ? res.rows : [];
    });
}

module.exports = {
  list,
  get,
  remove,
  query: queryTable,
  insert,
  update,
  queryList
};