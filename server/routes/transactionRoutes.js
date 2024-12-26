const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { protect } = require('../middleware/authMiddleware');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title isbn')
      .populate('user', 'name email');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Issue book
router.post('/issue', async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body;

    // Check book availability
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.availableQuantity < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Create transaction
    const transaction = new Transaction({
      book: bookId,
      user: userId,
      dueDate: new Date(dueDate)
    });

    // Update book availability
    book.availableQuantity -= 1;
    await book.save();

    const newTransaction = await transaction.save();
    await newTransaction.populate('book', 'title isbn');
    await newTransaction.populate('user', 'name email');

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Return book
router.put('/return/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction
    transaction.returnDate = new Date();
    transaction.status = 'returned';

    // Calculate fine if overdue
    const dueDate = new Date(transaction.dueDate);
    const returnDate = new Date(transaction.returnDate);
    if (returnDate > dueDate) {
      const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      transaction.fine = daysLate * 1; // $1 per day
    }

    // Update book availability
    const book = await Book.findById(transaction.book);
    book.availableQuantity += 1;
    await book.save();

    const updatedTransaction = await transaction.save();
    await updatedTransaction.populate('book', 'title isbn');
    await updatedTransaction.populate('user', 'name email');

    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/transactions/borrow/:bookId - Borrow a book
router.post('/borrow/:bookId', protect, async (req, res) => {
  try {
    // Find the book
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check availability
    if (book.availableQuantity === 0) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Check if user already has this book
    const existingTransaction = await Transaction.findOne({
      user: req.user._id,
      book: book._id,
      status: 'borrowed'
    });

    if (existingTransaction) {
      return res.status(400).json({ message: 'You already have this book borrowed' });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create new transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      book: book._id,
      dueDate: dueDate,
      status: 'borrowed'
    });

    // Update book availability
    book.availableQuantity -= 1;
    book.borrowers.push({
      user: req.user._id,
      dueDate: dueDate
    });
    await book.save();

    // Return the transaction with populated fields
    await transaction.populate('book', 'title author');
    await transaction.populate('user', 'name');

    res.status(201).json({
      message: 'Book borrowed successfully',
      transaction: transaction
    });

  } catch (error) {
    console.error('Borrow error:', error);
    res.status(500).json({ 
      message: 'Failed to borrow book',
      error: error.message 
    });
  }
});

// PUT /api/transactions/return/:transactionId - Return a book
router.put('/return/:transactionId', protect, async (req, res) => {
  try {
    console.log('Return request for transactionId:', req.params.transactionId);

    // Find the transaction first
    const transaction = await Transaction.findOne({
      _id: req.params.transactionId,
      user: req.user._id,
      status: 'borrowed'
    });

    if (!transaction) {
      return res.status(404).json({ 
        message: 'No active borrow record found'
      });
    }

    // Find the book
    const book = await Book.findById(transaction.book);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update transaction
    transaction.status = 'returned';
    transaction.returnDate = new Date();

    // Calculate fine if overdue
    const dueDate = new Date(transaction.dueDate);
    const returnDate = new Date();
    if (returnDate > dueDate) {
      const daysLate = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
      transaction.fine = daysLate * 1; // $1 per day
    }

    await transaction.save();

    // Update book availability
    book.availableQuantity += 1;
    book.borrowers = book.borrowers.filter(
      b => b.user.toString() !== req.user._id.toString()
    );
    await book.save();

    console.log('Successfully returned book:', {
      bookId: book._id,
      transactionId: transaction._id
    });

    res.json({ 
      message: 'Book returned successfully',
      transaction: {
        _id: transaction._id,
        returnDate: transaction.returnDate,
        fine: transaction.fine || 0
      }
    });

  } catch (error) {
    console.error('Return error:', error);
    res.status(500).json({ 
      message: 'Failed to return book',
      error: error.message 
    });
  }
});

// GET /api/transactions/my-books
router.get('/my-books', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
      status: 'borrowed'
    }).populate('book');

    console.log('Found borrowed books:', transactions.length); // Debug log

    const borrowedBooks = transactions.map(transaction => ({
      _id: transaction.book._id,
      title: transaction.book.title,
      author: transaction.book.author,
      isbn: transaction.book.isbn,
      dueDate: transaction.dueDate,
      borrowDate: transaction.borrowDate,
      isOverdue: new Date() > new Date(transaction.dueDate),
      transactionId: transaction._id // Add this to help with debugging
    }));

    res.json(borrowedBooks);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ message: 'Error fetching borrowed books' });
  }
});

// GET /api/transactions/history
router.get('/history', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
      status: { $in: ['returned', 'borrowed'] }
    })
    .populate('book', 'title author isbn')
    .sort({ createdAt: -1 }); // Most recent first

    const history = transactions.map(transaction => ({
      _id: transaction._id,
      book: {
        _id: transaction.book._id,
        title: transaction.book.title,
        author: transaction.book.author,
        isbn: transaction.book.isbn
      },
      status: transaction.status,
      borrowDate: transaction.borrowDate,
      returnDate: transaction.returnDate,
      dueDate: transaction.dueDate,
      isOverdue: transaction.status === 'borrowed' && new Date() > new Date(transaction.dueDate)
    }));

    res.json(history);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
});

module.exports = router; 