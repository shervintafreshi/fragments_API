// src/model/data/index.js
const logger = require('../../logger');

// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');

logger.info('----------------------------------------------');
logger.info('LOADING OF THE MEMORY MODULE - data/index.js');
logger.info('VALUE OF THE AWS REGION ENVIRONMENT VAR: ', process.env.AWS_REGION);
logger.info('----------------------------------------------');
