const express = require('express');
const secure = require('./secure');
const response = require('../../../network/response');
const controller = require('./index');

const router = express.Router();

function list(req, res, next) {
  controller.list()
    .then(lista => {
      response.success(req, res, lista, 200);
    })
    .catch(next);  // Se pone next como la función handler de errores para
    // que el middleware definido para el manejo de errores se haga cargo de
    // tratar el error.
}

function upsert(req, res, next) {
  const data = {};
  controller.upsert(req.body)
    .then(item => {
      response.success(req, res, item, 201);
    })
    .catch(next);
}

function get(req, res, next) {
  controller.get(req.params.id)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch(next);
}

router.get('/', list);
router.post('/', upsert);
router.get('/:id', get);
router.put('/', secure('update'), upsert);

module.exports = router;