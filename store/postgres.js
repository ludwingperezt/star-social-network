/**
 * Crear un pool de conexión con postgres.
 * 
 * Fuentes:
 * https://node-postgres.com/features/pooling
 * https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
 */
const { Pool } = require('pg');
const config = require('../config');

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

module.exports = {
  list,
};