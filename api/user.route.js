const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const config = require('config');

const User = require('../models/User');
const ResponseError = require('./../ResponseError');
const bruteMiddleware = require('./../middleware/brute.middleware');
const router = Router();

// api/signup
router.post(
    '/signup',
    [
        check('login', 'The length of login should be from 3 to 15').isLength({ min: 3, max: 15 }),
        check('password', 'Minimal length of password is 6 symbols').isLength(6)
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new ResponseError('Incorrect input data', 400, errors.array()));
            }

            const { login, password } = req.body;
            await User.signUp(login, password);
            res.status(201).json({ message: 'User is creted' });
        } catch (e) {
            next(e);
        }
    }
);

// api/signin
router.post(
    '/signin',
    [
        check('login', 'Incorrect login').isLength({ min: 3, max: 15 }),
        check('password', 'Minimal length of password is 6 symbols').exists()
    ],
    bruteMiddleware,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(new ResponseError('Incorrect input data', 400, errors.array()));
            }

            const { login, password } = req.body;
            const token = await User.signIn(login, password);
            res.cookie('authcookie', token, { maxAge: config.get('ttlMs') });
            res.status(200).json({ message: 'Successfully authorized' });
        } catch (e) {
            next(e);
        }
    }
);

module.exports = router;