const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const ResponseError = require('./../ResponseError');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const router = Router();

// api/game/state
router.get(
    '/state',
    auth,
    async (req, res, next) => {
        try {
            const userState = await User.getState(req.user.userId);
            res.status(200).json(userState);
        } catch (e) {
            next(e);
        }
    }
);

// api/game
router.post(
    '/',
    [
        check('count', 'Incorrect number of purchasing card').isInt({ min: 1, max: 10 })
    ],
    auth,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(new ResponseError('Incorrect input data', 400, errors.array()));
            }
            const { count } = req.body;

            await User.purchaseCards(req.user.userId, count);

            res.status(201).json({ message: 'Cards are purchased.' });
        } catch (e) {
            next(e);
        }
    }
);

// api/game/cell
router.post(
    '/cell',
    [
        check('cell', 'Incorrect index of opening cell').isInt({ min: 0, max: 8 })
    ],
    auth,
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ResponseError('Incorrect input data', 400, errors.array()));
        }

        const { id, cell } = req.body;
        try {
            await User.openCell(req.user.userId, id, cell);
            res.status(200).json({ message: 'Cell is opened.' });
        } catch (e) {
            next(e);
        }
    }
);

// api/game/end
router.post(
    '/end',
    auth,
    async (req, res, next) => {
        const { id } = req.body;
        try {
            await User.endGame(req.user.userId, id);
            res.status(200).json({ message: 'Game is ended' });
        } catch (e) {
            next(e);
        }
    }
);

module.exports = router;