// src/routes/api/index.js
const contentType = require('content-type');
const Fragment = require('../../model/fragment');

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Define our secondary route, which will be: POST /v1/fragments
router.post(
  '/fragments',
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  }),
  require('./post')
);

// Define our third route, which will be: GET /v1/fragments/:id.\:ext?
router.get('/fragments/:id\.:ext?', require('./get.id'));

// Define our fourth route, which will be: GET /v1/fragments/:id/info
router.get('/fragments/:id/info', require('./get.id.info'));

// Define our fifth route, which will be: DELETE /v1/fragments/:id
router.delete('/fragments/:id', require('./delete.id'));

// Define our sixth route, which will be: PUT /v1/fragments/:id
router.put(
  '/fragments/:id',
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  }),
  require('./put.id')
);

module.exports = router;
