// src/routes/api/get.id.js

const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');
const { convertFragment } = require('../../converter');

/**
 * Retrieve a fragment's data from the database and convert to .ext if needed
 */
module.exports = (req, res) => {
  const ownerId = crypto.createHash('sha256').update(req.user).digest('hex').substring(0, 8);
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
  
            // verify if conversion can take place
            const conversionType = Fragment.convertExtension(extension);
            if (fragment.formats.includes(conversionType)) {              
                // const convertedData = convertFragment(data, fragment.type, conversionType);
                // Send a 200 'OK' response
                convertFragment(data, fragment.type, conversionType).then((convertedData) => {
                  res.setHeader('content-type', conversionType);
                  res.status(200).send(convertedData);
                });
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
