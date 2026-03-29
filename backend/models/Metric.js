const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    required: true,
    default: 'gemini-1.5-flash'
  },
  endpoint: {
    type: String,
    required: true
  },
  promptTokens: {
    type: Number,
    default: 0
  },
  completionTokens: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  latency: {
    type: Number, // In milliseconds
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'error'],
    required: true
  },
  errorMessage: {
    type: String
  },
  cost: {
    type: Number,
    default: 0
  },
  input: {
    type: String // Log of input (careful with privacy)
  },
  output: {
    type: String // Log of output (careful with privacy)
  },
  feedback: {
    type: Number, // 1 for thumbs up, -1 for thumbs down
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Metric', MetricSchema);
