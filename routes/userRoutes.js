const router = require('express').Router();

const {
  signUp,
  signIn,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/updatepassword', protect, updatePassword);

router.route('/').get(protect, getAllUsers);

router.patch('/resetpassword/:resetToken', resetPassword);

module.exports = router;
