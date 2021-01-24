const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const ResponseError = require('./../ResponseError');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const router = Router();

// api/balance
router.get(
    '/',
    auth,
    async (req, res, next) => {
        try {
            const balance = await User.getBalance(req.user.userId);
            res.json({ balance: balance });
        } catch (e) {
            next(e);
        }
    }
);

// api/balance/increase
router.post(
    '/increase',
    [
        check('amount', 'The value should be integer from 1 to 50000').isInt({ min: 1, max: 50000 }),
    ],
    auth,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ResponseError('Incorrect input data', 400, errors.array()));
        }

        const { amount } = req.body;
        const { userId } = req.user;
        try {
            const balance = await User.increaseBalance(userId, amount);
            res.status(200).json({ balance });
        } catch (e) {
            next(e);
        }
    }
);

// api/balance/decrease
router.post(
    '/decrease',
    [
        check('amount', 'The value should be integer from 1 to 50000').isInt({ min: 1, max: 50000 }),
    ],
    auth,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ResponseError('Incorrect input data', 400, errors.array()));
        }

        const { amount } = req.body;
        const { userId } = req.user;
        try {
            const balance = await User.decreaseBalance(userId, amount);
            res.status(200).json({ balance });
        } catch (e) {
            next(e);
        }
    }
);

module.exports = router;