const router = require('express').Router();

const { signUp } = require('../controllers/authController');

router.route('/signup').post(signUp);

module.exports = router;
