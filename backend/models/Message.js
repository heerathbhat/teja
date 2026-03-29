const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    fileUrl: { type: String },
    fileType: { type: String, enum: ['image', 'video', 'audio', 'document'] },
    fileName: { type: String }
  }],
  role: {
    type: String,
    enum: ['user', 'model'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
