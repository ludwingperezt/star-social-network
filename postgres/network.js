const express = require('express');
const response = require('../network/response');
const store = require('../store/postgres');

const router = express.Router();

async function list(req, res, next) {
  const data = await store.list(req.params.table);
  response.success(req, res, data, 200);
}

async function insert(req, res, next) {
  const data = await store.insert(req.params.table, req.body);
  response.success(req, res, data, 201);
}

async function get(req, res, next) {
  const data = await store.get(req.params.table, req.params.id);
  response.success(req, res, data, 200);
}

async function update(req, res, next) {
  const data = await store.update(req.params.table, req.params.id, req.body);
  response.success(req, res, data, 201);
}

async function remove(req, res, next) {
  const data = await store.remove(req.params.table, req.params.id);
  response.success(req, res, null, 204);
}

async function queryList(req, res, next) {
  // Se expone un endpoint para realizar consultas un poco más complejas sobre
  // cualquier tabla.  En este caso el endpoint retorna una lista de elementos
  // coincidentes o una lista vacía si no los hay.
  // Recibe los parametros de construcción de la consulta en formato JSON
  // a través del query param 'filters'.
  let where = null;
  let selects = null;
  let joins = null;
  const txtFilters = req.query.filters;

  if (txtFilters) {
    const filters = JSON.parse(txtFilters);
    where = filters.where || null;
    selects = filters.selects || null;
    joins = filters.joins || null;
  }

  const data = await store.queryList(req.params.table, where, selects, joins);
  response.success(req, res, data, 200)
}

async function queryOne(req, res, next) {
  // Se expone un endpoint para realizar consultas un poco más complejas sobre
  // cualquier tabla.  En este caso el endpoint retorna un solo elemento que 
  // coincide con la búsqueda o null en caso contrario.
  // Recibe los parametros de construcción de la consulta en formato JSON
  // a través del query param 'filters'.
  let where = null;
  let selects = null;
  let joins = null;
  const txtFilters = req.query.filters;

  if (txtFilters) {
    const filters = JSON.parse(txtFilters);
    where = filters.where || null;
    selects = filters.selects || null;
    joins = filters.joins || null;
  }

  const data = await store.query(req.params.table, where, selects, joins);
  response.success(req, res, data, 200)
}

router.get('/:table/queryOne', queryOne);
router.get('/:table/query', queryList);
router.get('/:table', list);
router.post('/:table', insert);
router.get('/:table/:id', get);
router.put('/:table/:id', update);
router.delete('/:table/:id', remove);

module.exports = router;