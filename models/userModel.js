const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required!'],
  },

  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email! '],
  },

  role: {
    type: String,
    enum: ['user', 'guid', 'leader-guid', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: 8,
    maxlength: 15,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'PasswordConfirm is required!'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'PasswordConfirm is wrong, Pleas try again!',
    },
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Inheretans methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.checkIfPasswordChanged = function (jwtIat) {
  if (this.passwordChangedAt) {
    // getTime() method will convert date to milliseconds, And jwtIat in "seconds" so we need to convert the number to seconds (in bace 10 integer) with that we can compare
    const convertingToSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return convertingToSeconds > jwtIat;
  }

  return false;
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

const User = new mongoose.model('User', userSchema);

module.exports = User;
