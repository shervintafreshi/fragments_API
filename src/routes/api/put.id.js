// src/routes/api/get.id.js

const { createErrorResponse } = require('../../../src/response');
const { createSuccessResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Retrieve a fragment's data from the database and convert to .ext if needed
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('hex').substring(0, 8);
  const id = req.params.id;

  Fragment.byId(ownerId, id)
    .then((fragment) => {
      // verify if incoming content-type is matches current content-type
      if (fragment.type == req.headers['content-type']) {
        fragment
          .setData(req.body)
          .then(() => {
            const responseData = createSuccessResponse({
              fragment: {
                id: fragment.id,
                ownerId: fragment.ownerId,
                created: fragment.created,
                updated: fragment.updated,
                type: fragment.type,
                size: fragment.size,
              },
            });
            res.status(200).json(responseData);
          })
          .catch((error) => {
            // Send a 500 'error' response
            res.status(500).json(createErrorResponse(error));
          });
      } else {
        // Send a 400 'error' response
        const responseData = createErrorResponse(
          400,
          'Content-Type of the request does not match the existing fragments type'
        );
        res.status(404).json(responseData);
      }
    })
    .catch((error) => {
      // Send a 404 'error' response
      const responseData = createErrorResponse(404, 'Key not found: ' + error);
      res.status(404).json(responseData);
    });
};
