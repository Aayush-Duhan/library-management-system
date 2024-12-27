const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

router.get('/', protect, admin, async (req, res) => {
  try {
    const totalLoans = await Transaction.countDocuments();
    const activeLoans = await Transaction.countDocuments({ status: 'borrowed' });
    const overdueLoans = await Transaction.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });

    // Get popular books
    const popularBooks = await Transaction.aggregate([
      { $group: { 
        _id: '$book',
        loanCount: { $sum: 1 }
      }},
      { $sort: { loanCount: -1 }},
      { $limit: 5 },
      { $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'bookDetails'
      }},
      { $unwind: '$bookDetails' },
      { $project: {
        _id: '$bookDetails._id',
        title: '$bookDetails.title',
        author: '$bookDetails.author',
        loanCount: 1
      }}
    ]);

    res.json({
      totalLoans,
      activeLoans,
      overdueLoans,
      popularBooks
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

module.exports = router; 