const userApi = require('./user.route');
const gameApi = require('./game.route');
const balanceApi = require('./balance.route');

const ResponseError = require('./../ResponseError');

function api(server) {
    server.use('/api', userApi);
    server.use('/api/game', gameApi);
    server.use('/api/balance', balanceApi);
    server.get('*', (req, res, next) => {
        next(new ResponseError('Not found', 403));
    });
}

module.exports = api;