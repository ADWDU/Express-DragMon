module.exports = function(error, req, res, next) {
    if (!error.status) {
        error.status = 500;
    }

    if (!error.clientMessage) {
        error.clientMessage = 'Something went wrong.';
    }

    if (error.statusCode === 301) {
        return res.status(301).redirect('/not-found');
    }

    /* eslint-disable-next-line no-console */
    console.error(error);
    return res.status(error.status).json({ message: error.clientMessage, errors: error.errors });
};