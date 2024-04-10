const router = require('express').Router();

const {
  signUp,
  signIn,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restricTo,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateAuthenticatedUser,
  deleteAuthenticatedUser,
} = require('../controllers/userController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgotpassword', forgotPassword);
router.patch('/updatepassword', protect, updatePassword);

router.route('/').get(protect, restricTo('admin'), getAllUsers);
router.patch(
  '/updateAuthenticatedUser',
  protect,
  restricTo('admin', 'user'),
  updateAuthenticatedUser
);
router.delete(
  '/deleteAuthenticatedUser',
  protect,
  restricTo('admin', 'user'),
  deleteAuthenticatedUser
);

router.patch('/resetpassword/:resetToken', resetPassword);

module.exports = router;
