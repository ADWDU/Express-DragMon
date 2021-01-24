const jwt = require('jsonwebtoken');
const config = require('config');

const ResponseError = require('./../ResponseError');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const authCookie = req.cookies.authcookie;
        if (!authCookie) {
            return next(new ResponseError('Not authorized', 401));
        }

        const decoded = jwt.verify(authCookie, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (e) {
        next(new ResponseError('Bad token', 401));
    }
};