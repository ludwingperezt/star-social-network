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
  const data = await store.update(req.params.table, req.body.id, req.body);
  response.success(req, res, data, 201);
}

async function remove(req, res, next) {
  const data = await store.remove(req.params.table, req.body.id);
  response.success(req, res, null, 204);
}

router.get('/:table', list);
router.post('/:table', insert);
router.get('/:table/:id', get);
router.put('/:table/:id', update);
router.delete('/:table/:id', remove);

module.exports = router;