const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const config = require('config');

module.exports = new RateLimit({
    store: new MongoStore({
        uri: config.get('mongoUri'),
        collectionName: 'bruteRateRecords',

        /* eslint-disable-next-line no-console */
        errorHandler: (e) => console.error(e),

        // should match windowMs
        expireTimeMs: config.get('bruteTimeframeMs'),
    }),
    max: config.get('totalRequestInFrame'),
    windowMs: config.get('bruteTimeframeMs'),
    message: { message: 'Too many requests, please try again later.' }
});
