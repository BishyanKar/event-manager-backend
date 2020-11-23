var express = require('express');
var router = express.Router();

const admin = require('./admin/admin');
const login = require('./user/login');
const profile = require('./user/profile');
const band = require('./base/band');
const signup = require('./user/signup');
const artist = require('./base/artist');
const event = require('./base/event');
const inbox = require('./base/inbox');
const tickets = require('./base/tickets');
const food = require('./base/food');
const drink = require('./base/drink');
const goodie = require('./base/goodie');
const guestRequest = require('./base/guestRequest');

// router.use(async (req, res, next) => {
//     try {
//         console.log('hit');
//     } catch (error) {
//     //   res.status(error.statusCode || 500).send({ success: false, message: error.message });
//       console.log('Error: ', error);
//       throw new CustomError(error.message, error.statusCode || 500, 'Token error');
//     }
// });
  


router.use('/admin', admin);
router.use('/login', login);
router.use('/profile', profile);
router.use('/band', band);
router.use('/signup', signup);
router.use('/artist', artist);
router.use('/event', event);
// router.use('/inbox', inbox);
router.use('/tickets', tickets);
router.use('/food', food);
router.use('/drink', drink);
router.use('/goodie', goodie);
router.use('/guestRequest', guestRequest);

module.exports = router;