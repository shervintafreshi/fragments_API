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

// Define our third route, which will be: GET /v1/fragments/:id
router.get('/fragments/:id', require('./get.id'));

module.exports = router;
