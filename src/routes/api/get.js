// src/routes/api/get.js
const { createSuccessResponse } = require('../../../src/response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // Generate a success response
  const responseData = createSuccessResponse({
    fragments: [],
  });

  // Send a 200 'OK' response
  res.status(200).json(responseData);
};
