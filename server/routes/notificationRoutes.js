const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');

// GET /api/notifications - Get user notifications
router.get('/', protect, async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Find overdue books
    const overdue = await Transaction.find({
      user: req.user._id,
      status: 'borrowed',
      dueDate: { $lt: today }
    }).populate('book', 'title');

    // Find books due soon
    const upcomingDue = await Transaction.find({
      user: req.user._id,
      status: 'borrowed',
      dueDate: {
        $gte: today,
        $lte: threeDaysFromNow
      }
    }).populate('book', 'title');

    res.json({
      upcomingDue: upcomingDue.map(t => ({
        bookTitle: t.book.title,
        dueDate: t.dueDate
      })),
      overdue: overdue.map(t => ({
        bookTitle: t.book.title,
        dueDate: t.dueDate,
        daysOverdue: Math.ceil((today - new Date(t.dueDate)) / (1000 * 60 * 60 * 24))
      }))
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router; 