const mongoose = require('mongoose');

const factSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  source: {
    type: String,
    default: 'Unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
factSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Fact = mongoose.model('Fact', factSchema);

module.exports = Fact;