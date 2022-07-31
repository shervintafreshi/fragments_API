// src/routes/api/post.js

const { createSuccessResponse } = require('../../../src/response');
const { createErrorResponse } = require('../../../src/response');

const Fragment = require('../../model/fragment');
const crypto = require('crypto');
const logger = require('../../logger');

const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Save the user-provided Fragment to the In-Memory DB
 */
module.exports = (req, res) => {
  // Generate and Retrieve the required fragment properties
  const ownerId = crypto.createHash('sha256').update(req.user).digest('hex').substring(0, 8);
  const contentType = req.headers['content-type'];

  // verify the content-type is supported
  const supported = Fragment.isSupportedType(contentType);

  // Send an appropriate response
  if (supported) {
    // add the fragment to the DB
    const fragment = new Fragment({
      ownerId: ownerId,
      type: contentType,
    });

    fragment
      .save()
      .then(() => {
        logger.info('----------------------------------------------');
        logger.info('FRAGMENTATION WRITE PROCESS IN POST REQUEST - Post.js');
        logger.info('----------------------------------------------');

        logger.info('----------------------------------------------');
        logger.info(process.env.AWS_REGION);
        logger.info('----------------------------------------------');

        logger.info('----------------------------------------------');
        logger.info(process.env.AWS_S3_BUCKET_NAME);
        logger.info('----------------------------------------------');

        logger.info('----------------------------------------------');
        logger.info(process.env.AWS_COGNITO_CLIENT_ID);
        logger.info('----------------------------------------------');

        logger.info('----------------------------------------------');
        logger.info(contentType);
        logger.info('----------------------------------------------');


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
            res.location(apiUrl + '/v1/fragments/' + fragment.id);
            res.status(201).json(responseData);
          })
          .catch((error) => {
            // Send a 500 'error' response
            const responseData = createErrorResponse(500, 'Failed to save fragment data: ' + error);
            res.status(500).json(responseData);
          });
      })
      .catch((error) => {
        // Send a 500 'error' response
        const responseData = createErrorResponse(500, 'Failed to : ' + error);
        res.status(500).json(responseData);
      });
  } else {
    // Send a 415 'error' response
    const responseData = createErrorResponse(415, 'Content-Type not currently Supported');
    res.status(415).json(responseData);
  }
};
