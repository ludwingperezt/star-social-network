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

async function insert (table, data) {
  const fieldsNames = Object.keys(data);
  let fields = fieldsNames.join(', ');
  const values = []
  const valuesRef = []

  // const userExist = await queryOne(table, {username: data.username})
  
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

async function queryList(table, q, selects, joins) {

  // Procesar JOINS
  let queryJoins = '';
  if (Array.isArray(joins) && joins.length) {
    const listJoins = joins.map(value => {
      return `${value.type} JOIN ${SCHEMA}.${value.table} ON ${SCHEMA}.${value.table}.${value.key} = ${SCHEMA}.${value.referenceTable}.${value.referenceKey}`
    });

    queryJoins = listJoins.join(' ');
  }

  // Procesar campos para SELECT
  // Si no se especifica, seleccionar todos los campos
  let querySelects = '*';

  if (Array.isArray(selects) && selects.length) {
    querySelects = selects.join(', ');
  }

  // Preparar sentencia WHERE
  let valuesOrder = '';
  let values = []
  if (q) {
    const fieldsNames = Object.keys(q);
    const valuesRef = []

    fieldsNames.forEach((item, index) => {
        valuesRef.push(`${item} = $${index + 1}`)
        values.push(q[item])
      })

    valuesOrder = 'WHERE ' + valuesRef.join(' AND ');
  }

  const query = `SELECT ${querySelects} FROM ${SCHEMA}.${table} ${queryJoins} ${valuesOrder}`

  return pool
    .query(query, values)
    .then(res => {
      return (res.rowCount) ? res.rows : [];
    });
}

async function queryOne(table, q, selects, joins) {
  const elements = await queryList(table, q, selects, joins);

  return (elements.length) ? elements[0] : null;
}

module.exports = {
  list,
  get,
  remove,
  query: queryOne,
  insert,
  update,
  queryList
};