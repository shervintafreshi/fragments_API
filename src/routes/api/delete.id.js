const { createSuccessResponse } = require('../../../src/response');
const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Delete a fragment from the database
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('hex').substring(0, 8);
  const id = req.params.id;

  Fragment.byId(ownerId, id)
    .then(() => {
      Fragment.delete(ownerId, id).then(() => {
        // Send a 200 'OK' Response
        const responseData = createSuccessResponse();
        res.status(200).send(responseData);
      });
    })
    .catch(() => {
      // Send 404 'Error' Response
      const responseData = createErrorResponse(404, 'Resource not found');
      res.status(404).json(responseData);
    });
};
