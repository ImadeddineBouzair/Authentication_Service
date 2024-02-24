const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/nodeMailer');

const asyncVerify = (token) => {
  return new Promise(function (resolve, reject) {
    return resolve(jwt.verify(token, process.env.JWT_SECRET_KEY));
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true, // scure against cross site scripting
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Removing the password from the res body
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// --------------------------

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, role, password, passwordConfirm } = req.body;

  const user = new User({
    name,
    email,
    role,
    password,
    passwordConfirm,
  });

  const newUser = await user.save();

  createSendToken(newUser, 201, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password))
    return next(new AppError('Email and password fields are required!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!(user && (await user.comparePassword(password))))
    return next(new AppError('Invalid email or password pls try again'), 401);

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return next(
      new AppError('You are not logged in, Pleas logIn to get access!', 401)
    );

  const decodedToken = await asyncVerify(token);
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this ID does no longer exist.', 401)
    );

  // Check if the password has been changed
  if (currentUser.checkIfPasswordChanged(decodedToken.iat))
    return next(
      new AppError('User recently changed password, Pleas log in again!', 401)
    );

  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError('Ther is no user with this email adress', 404));

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Creating reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resettoken/${resetToken}`;

  const message = `Forgot your password? Submit a patch request with your new password to: ${resetUrl}. \n If you did not forgot your password pleas ignore this email!`;

  try {
    await sendEmail({
      email,
      subject: 'Your password reset token (valid for 5 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return next(
      new AppError(
        'There is an error appear with sending email, Please try again later!'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError('Invalid reset token or has expired!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (!(await user.comparePassword(currentPassword)))
    return next(new AppError('Current password is wrong, Try again!', 401));

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.restricTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You don't have permission to perform this action!`, 403)
      );
    }

    next();
  };
