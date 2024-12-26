const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

router.get('/recommendations', protect, async (req, res) => {
  try {
    // Get user's borrowed books categories
    const userTransactions = await Transaction.find({ user: req.user._id })
      .populate('book', 'category');
    
    const userCategories = [...new Set(
      userTransactions.map(t => t.book.category)
    )];

    // Get recommended books from same categories
    const recommendations = await Book.find({
      category: { $in: userCategories },
      availableQuantity: { $gt: 0 },
      _id: { 
        $nin: userTransactions.map(t => t.book._id) 
      }
    }).limit(5);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

module.exports = router; 