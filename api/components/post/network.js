const express = require('express');
const response = require('../../../network/response');
const controller = require('./index');
const secure = require('../user/secure');

const router = express.Router();

function list(req, res, next) {
  controller.list()
    .then(data => {
      response.success(req, res, data, 200);
    })
    .catch(next);
}

function insert(req, res, next) {
  const idUser = req.user.id;
  controller.insert(req.body, idUser)
    .then(data => {
      response.success(req, res, data, 201);
    })
    .catch(next)
}

function get(req, res, next) {
  controller.get(req.params.id)
    .then((post) => {
      if (post) {
        response.success(req, res, post, 200);
      }
      else {
        response.error(req, res, 'No encontrado', 404)
      }
    })
    .catch(next);
}

function update(req, res, next) {
  controller.update(req.params.id, req.body)
    .then(item => {
      response.success(req, res, item, 200);
    })
    .catch(next);
}

function remove(req, res, next) {
  controller.remove(req.params.id)
    .then(() => {
      response.success(req, res, null, 204)
    })
    .catch(next);
}

router.get('/', list);
router.post('/', secure('logged'), insert);
router.get('/:id', get);
router.put('/:id', secure('logged'), update);
router.delete('/:id', secure('logged'), remove);

module.exports = router;