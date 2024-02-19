const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Name is required!'],
  },

  birthDate: {
    type: Date,
    required: [true, 'birthDate is required!'],
  },

  email: {
    type: String,
    required: [true, 'Email is required!'],
  },

  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: 8,
    maxlength: 15,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'PasswordConfirm is required!'],
  },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
