// src/routes/api/get.js
const { createSuccessResponse } = require('../../../src/response');
const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // Verify if user requested full metadata
  const expand = req.query.expand == 1;
  const ownerId = crypto.createHash('sha256').update(req.user).digest('hex').substring(0, 8);

  // Query the database
  Fragment.byUser(ownerId, expand)
    .then((fragments) => {
      // Send a 200 'OK' response
      const responseData = createSuccessResponse({
        fragments,
      });
      res.status(200).json(responseData);
    })
    .catch(() => {
      // Send a 404 'error' response
      const responseData = createErrorResponse(404, 'Resource not found');
      res.status(404).json(responseData);
    });
};
