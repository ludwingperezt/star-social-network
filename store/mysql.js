/**
 * Componente de conexión con MySQL
 */

const mysql = require('mysql');

const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    db: config.mysql.database
};

// Conexión
let connection;

function handleConn() {
    connection = mysql.createConnection(dbconfig);

    connection.connect((err) => {
        if (err) {
            // Si sucede algún error durante la conexión entonces intentar reconectar 2 segundos despúes
            console.error('[db error]', err);
            setTimeout(handleConn, 2000);
        }
        else {
            console.log('Mysql conectado')
        }
    });

    connection.on('error', err => {
        console.error('[db error]', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // Si se ha perdido la conexión intenta volver a conectar
            handleConn();
        }
        else {
            throw err;
        }
    })
}

handleConn();

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

async function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id = '${id}'`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

async function remove(table, id) {  
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table} WHERE id = '${id}'`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

async function insert (table, data) {

    const q = `INSERT INTO ${table} SET ?`;

    return new Promise((resolve, reject) => {
        connection.query(q, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}
  
async function update (table, id, data) {

    const q = `UPDATE ${table} SET ? WHERE id=?`
  
    return new Promise((resolve, reject) => {
        connection.query(q, [data, data.id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

async function queryList(table, q, selects, joins) {

    // Procesar JOINS
    let queryJoins = '';
    if (Array.isArray(joins) && joins.length) {
      const listJoins = joins.map(value => {
        return `${value.type} JOIN ${value.table} ON ${value.table}.${value.key} = ${value.referenceTable}.${value.referenceKey}`
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
  
    const _q = `SELECT ${querySelects} FROM ${table} ${queryJoins} ${valuesOrder}`
  
    return new Promise((resolve, reject) => {
        connection.query(_q, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
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

