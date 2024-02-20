const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
