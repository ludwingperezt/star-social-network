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
      if (user) {
        response.success(req, res, user, 200);
      }
      else {
        response.error(req, res, 'No encontrado', 404)
      }
    })
    .catch(next);
}

function insert(req, res, next) {
  controller.insert(req.body)
    .then(item => {
      response.success(req, res, item, 201)
    })
    .catch(next)
}

function update(req, res, next) {
  const data = {};
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

function follow(req, res, next) {
  controller.follow(req.user.id, req.params.id)
    .then(data => {
      response.success(req, res, data, 201);
    })
    .catch(next);
}

function followers(req, res, next) {
  const idUser = req.params.id || req.user.id;
  controller.followers(idUser)
    .then(followers => {
      response.success(req, res, followers, 200);
    })
    .catch(next); 
}

router.get('/', list);
// router.post('/', upsert);
router.post('/', insert);
router.get('/:id', get);
//router.put('/', secure('update'), upsert);
router.put('/:id', secure('update'), update);
router.delete('/:id', secure('delete'), remove);
router.get('/followers/:id', followers); // listar seguidores de un usuario
router.get('/followers', secure('follow'), followers); // listar mis propios seguidores
router.post('/follow/:id', secure('follow'), follow);

module.exports = router;