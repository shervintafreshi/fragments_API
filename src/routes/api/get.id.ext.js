// src/routes/api/get.id.js

const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');
const markdownIt = require('markdown-it')({ html: true });

/**
 * Retrieve a fragment's data from the database and convert to requested type
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('base64');
  const id = req.params.id;
  const extension = req.params.ext;

  Fragment.byId(ownerId, id)
    .then((fragment) => {
      if (fragment.formats.includes(extension)) {
        // Convert the fragment data to requested type
        if (fragment.type == 'text/markdown') {
          fragment
            .getData()
            .then((data) => {
              // Send a 200 'OK' response
              const convertedData = markdownIt.render(data);
              res.setHeader('content-type', 'text/html');
              res.status(200).send(convertedData);
            })
            .catch((error) => {
              // Send a 500 'error' response
              const responseData = createErrorResponse(500, 'Failed to get user data: ' + error);
              res.status(500).json(responseData);
            });
        }
      } else {
        // Send a 415 'error' response
        const responseData = createErrorResponse(
          415,
          `${fragment.mimeType} cannot be returned as ${extension}`
        );
        res.status(415).json(responseData);
      }
    })
    .catch((error) => {
      // Send a 404 'error' response
      const responseData = createErrorResponse(404, 'Key not found: ' + error);
      res.status(404).json(responseData);
    });
};
