const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

// Admin Dashboard Route
router.get('/admin/dashboard', protect, admin, async (req, res) => {
  try {
    // Get dashboard stats
    const totalBooks = await Book.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });
    const activeLoans = await Transaction.countDocuments({ status: 'borrowed' });
    const overdueBooks = await Transaction.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });

    // Get recent activities
    const recentActivities = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('book', 'title');

    res.json({
      stats: {
        totalBooks,
        activeUsers,
        activeLoans,
        overdueBooks
      },
      activities: recentActivities.map(activity => ({
        id: activity._id,
        type: activity.status,
        user: activity.user.name,
        book: activity.book.title,
        date: activity.createdAt
      }))
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Error fetching admin dashboard data' });
  }
});

// User Dashboard Route
router.get('/users/dashboard', protect, async (req, res) => {
  try {
    const borrowedBooks = await Transaction.find({
      user: req.user._id,
      status: 'borrowed'
    }).populate('book');

    const recentActivity = await Transaction.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('book');

    res.json({
      stats: {
        currentlyBorrowed: borrowedBooks.length,
        totalBorrowed: await Transaction.countDocuments({ user: req.user._id }),
        overdueBooks: await Transaction.countDocuments({
          user: req.user._id,
          status: 'borrowed',
          dueDate: { $lt: new Date() }
        })
      },
      borrowedBooks,
      recentActivity
    });
  } catch (error) {
    console.error('User dashboard error:', error);
    res.status(500).json({ message: 'Error fetching user dashboard data' });
  }
});

module.exports = router; 