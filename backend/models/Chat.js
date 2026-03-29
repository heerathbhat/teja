const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'New Chat'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);
