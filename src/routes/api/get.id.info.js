const { createSuccessResponse } = require('../../../src/response');
const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Retrieve a fragment's meta-data from the database
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('base64');
  const id = req.params.id;

  Fragment.byId(ownerId, id)
    .then((fragment) => {
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
      res.status(200).send(responseData);
    })
    .catch(() => {
      const responseData = createErrorResponse(404, 'Resource not found');
      res.status(404).json(responseData);
    });
};
