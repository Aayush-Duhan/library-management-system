const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  totalQuantity: {
    type: Number,
    required: true,
    default: 1
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fiction', 'non-fiction', 'science', 'technology', 'history', 'arts']
  },
  location: {
    type: String
  },
  borrowers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
}, {
  timestamps: true
});

// Add indexes for better performance
bookSchema.index({ _id: 1, 'borrowers.user': 1 });

// Virtual for availability status
bookSchema.virtual('status').get(function() {
  if (this.availableQuantity === 0) return 'unavailable';
  if (this.availableQuantity < this.totalQuantity) return 'partially_available';
  return 'available';
});

// Include virtuals when converting to JSON
bookSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema); 