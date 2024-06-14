const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
    linkid: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const ForgotPassword = mongoose.model('forgotpassword', forgotPasswordSchema);

module.exports = ForgotPassword;
