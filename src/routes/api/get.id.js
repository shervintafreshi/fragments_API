// src/routes/api/get.id.js

const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');
const markdownIt = require('markdown-it')({ html: true });

/**
 * Retrieve a fragment's data from the database and convert to .ext if needed
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('base64');
  const id = req.params.id;
  let extension = req.params.ext;

  Fragment.byId(ownerId, id)
    .then((fragment) => {
      fragment
        .getData()
        .then((data) => {
          if (typeof extension === 'undefined') {
            // Send a 200 'OK' response
            res.setHeader('content-type', fragment.type);
            res.status(200).send(data);
          } else {
            // convert to extension str to usable format
            if (extension == 'html' || extension == 'txt' || extension == 'md') {
              extension = 'text/' + extension;
            }

            // verify if conversion can take place
            if (fragment.formats.includes(extension)) {
              if (fragment.type == 'text/markdown') {

                // Send a 200 'OK' response
                let convertedData = markdownIt.render(data.toString());
                convertedData = convertedData.trim();
                res.setHeader('content-type', 'text/html');
                res.status(200).send(convertedData);
              } else {
                // Send a 415 'error' response
                const responseData = createErrorResponse(
                  415,
                  `${fragment.mimeType} cannot be returned as ${extension}, conversion not currently supported`
                );
                res.status(415).json(responseData);
              }
            } else {
              // Send a 415 'error' response
              const responseData = createErrorResponse(
                415,
                `${fragment.mimeType} cannot be returned as ${extension}`
              );
              res.status(415).json(responseData);
            }
          }
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
