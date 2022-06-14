// src/routes/api/post.js

const { createSuccessResponse } = require('../../../src/response');
const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const { nanoid } = require('nanoid');
const crypto = require('crypto');

/**
 * Save the user-provided Fragment to the In-Memory DB
 */
module.exports = (req, res) => {
  // Generate/Calculate the required fragment properties
  const id = nanoid();
  const ownerId = crypto.createHash('sha256').update('userEmail').digest('base64');
  const isoDate = JSON.stringify(new Date());
  const contentType = req.headers['content-type'];
  const size = Buffer.byteLength(req.body);

  // verify the content-type is supported
  const supported = Fragment.isSupportedType(contentType);

  // Send an appropriate response
  if (supported) {
    // add the fragment to the DB
    const fragment = new Fragment(id, ownerId, isoDate, isoDate, contentType, size);
    console.log(fragment);
    fragment
      .save()
      .then(() => {
        fragment
          .setData(req.body.toString())
          .then(() => {
            const responseData = createSuccessResponse({
              fragments: {
                id: id,
                ownerId: ownerId,
                created: isoDate,
                updated: isoDate,
                type: contentType,
                size: size,
              },
            });

            res.location('http://localhost:8080/v1/fragments/' + id);
            res.status(201).json(responseData);
          })
          .catch((error) => {
            console.log('Error called here' + error);
          });
      })
      .catch((error) => {
        console.log('Error called here ' + error);
      });
  } else {
    // Send a 415 'error' response
    const responseData = createErrorResponse(415, 'Content-Type not currently Supported');
    res.status(415).json(responseData);
  }
};
