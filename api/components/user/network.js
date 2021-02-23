const express = require('express');

const response = require('../../../network/response');
const controller = require('./index');

const router = express.Router();

function list(req, res) {
  controller.list()
    .then(lista => {
      response.success(req, res, lista, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
}

function upsert(req, res) {
  const data = {};
  controller.upsert(req.body)
    .then(item => {
      response.success(req, res, item, 201);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
}

function get(req, res) {
  controller.get(req.params.id)
    .then((user) => {
      response.success(req, res, user, 200);
    })
    .catch((err) => {
      response.error(req, res, err.message, 500);
    });
}

router.get('/', list);
router.post('/', upsert);
router.get('/:id', get);

module.exports = router;