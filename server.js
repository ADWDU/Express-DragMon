const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const api = require('./api');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();
app.use(express.json({ extended: true }));

app.use(require('cookie-parser')());
api(app);

// Use error handler after using all routes
app.use(errorHandler);

const port = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            autoCreate: true,
        });

        /* eslint-disable-next-line no-console */
        app.listen(config.port, () => console.log(`express started on port ${port}...`));
    } catch (e) {
        /* eslint-disable-next-line no-console */
        console.log(`error while connected to mongoose. Message: ${e.message}`);
        /* eslint-disable-next-line no-undef */
        process.exit(1);
    }
}

start();
