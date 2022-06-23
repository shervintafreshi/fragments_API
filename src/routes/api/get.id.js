// src/routes/api/get.id.js

const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Retrieve a fragment's data from the database
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('base64');
  const id = req.params.id;

  Fragment.byId(ownerId, id)
    .then((fragment) => {
      fragment
        .getData()
        .then((data) => {
          res.setHeader('content-type', fragment.type);
          res.status(200).send(data);
        })
        .catch((error) => {
          // Send a 500 'error' response
          const responseData = createErrorResponse(500, 'Failed to get user data: ' + error);
          res.status(500).json(responseData);
        });
    })
    .catch((error) => {
      // Send a 404 'error' response
      const responseData = createErrorResponse(404, 'Key not found: ' + error);
      res.status(404).json(responseData);
    });
};
