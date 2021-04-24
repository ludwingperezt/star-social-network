/**
 * En este archivo se define la interfaz de acceso al servicio (API) de la base
 * de datos.  Para hacer las peticiones http se utiliza la librería 'request'
 * y hace solicitudes a los endpoints de la API definidos en postgres/network.js
 * (a través de la app definida en postgres/index.js)
 */
const request = require('request');

function createRemoteDb(host, port) {
  const URL = `http://${host}:${port}`;

  function req(method, table, id, data, filters, queryPath) {
    let url = `${URL}/${table}`;

    if (id) {
      url = `${url}/${id}`;
    }

    let body = '';

    if (data) {
      body = JSON.stringify(data);
    }

    let strFilters = ''
    if (filters) {
      strFilters = JSON.stringify(filters);
      url = `${url}/${queryPath}?filters=${strFilters}`;
    }

    return new Promise((resolve, reject) => {
      request({
        method, 
        headers: {
          'content-type': 'application/json'
        },
        url,
        body,
      }, (err, requ, result) => {
        if (err) {
          console.error('Error con DB remota', err);
          return reject(err.message);
        }
        
        if (result) {
          const response = JSON.parse(result);
          return resolve(response.body);
        }
        return resolve()
      });
    })
  }

  function list(table) {
    return req('GET', table);
  }

  function get(table, id) {
    return req('GET', table, id)
  }

  function insert(table, data) {
    return req('POST', table, null, data);
  }

  function update(table, id, data) {
    return req('PUT', table, id, data);
  }

  function remove(table, id) {
    return req('DELETE', table, id);
  }

  function queryList(table, where, selects, joins) {
    // Consultar el enpoint que filtra los datos de una tabla y que retorna
    // varios resultados o una lista vacía.
    // Los parametros de filtrado como sentencias where, join y campos de select
    // se envían como query params al endpoint en formato json
    const filters = {}

    if (where) {
      filters.where = where;
    }

    if (selects) {
      filters.selects = selects
    }

    if (joins) {
      filters.joins = joins;
    }

    return req('GET', table, null, null, filters, 'query');
  }

  function queryOne(table, where, selects, joins) {
    // Consultar el enpoint que filtra los datos de una tabla y que retorna
    // un solo resultado o null si no hay coincidencias.
    // Los parametros de filtrado como sentencias where, join y campos de select
    // se envían como query params al endpoint en formato json
    const filters = {}

    if (where) {
      filters.where = where;
    }

    if (selects) {
      filters.selects = selects
    }

    if (joins) {
      filters.joins = joins;
    }

    return req('GET', table, null, null, filters, 'queryOne');
  }

  return {
    list,
    get,
    insert,
    update,
    remove,
    queryList,
    query: queryOne
  }
}

module.exports = createRemoteDb;