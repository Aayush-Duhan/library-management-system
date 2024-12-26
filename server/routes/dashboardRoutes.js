const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Book = require('../models/Book');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// GET /api/admin/dashboard
router.get('/admin/dashboard', protect, admin, async (req, res) => {
  try {
    const stats = {
      totalBooks: await Book.countDocuments(),
      activeUsers: await User.countDocuments({ active: true }),
      activeLoans: await Transaction.countDocuments({ status: 'borrowed' }),
      overdueBooks: await Transaction.countDocuments({
        status: 'borrowed',
        dueDate: { $lt: new Date() }
      })
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// GET /api/users/dashboard
router.get('/users/dashboard', protect, async (req, res) => {
  try {
    const borrowedBooks = await Transaction.find({
      user: req.user._id,
      status: 'borrowed'
    }).populate('book', 'title author isbn');

    // Always return a valid response structure
    res.json({
      borrowedBooks: borrowedBooks ? borrowedBooks.map(transaction => ({
        _id: transaction.book._id,
        title: transaction.book.title,
        author: transaction.book.author,
        isbn: transaction.book.isbn,
        dueDate: transaction.dueDate,
        isOverdue: new Date() > new Date(transaction.dueDate)
      })) : [],
      recentlyViewed: [] // Add this if you implement recently viewed functionality
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      borrowedBooks: [],
      recentlyViewed: []
    });
  }
});

module.exports = router; 