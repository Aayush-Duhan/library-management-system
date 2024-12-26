const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const mongoose = require('mongoose');
const { protect } = require('../middleware/authMiddleware');
const Review = require('../models/Review');

// Get all books
router.get('/', async (req, res) => {
  try {
    const { category, availability, sortBy, search } = req.query;
    
    let query = {};
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Availability filter
    if (availability === 'available') {
      query.availableQuantity = { $gt: 0 };
    } else if (availability === 'borrowed') {
      query.availableQuantity = { $lt: mongoose.Types.ObjectId(req.query.totalQuantity) };
    }

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'title':
        sort.title = 1;
        break;
      case 'author':
        sort.author = 1;
        break;
      case 'recent':
        sort.createdAt = -1;
        break;
      default:
        sort.title = 1;
    }

    const books = await Book.find(query)
      .sort(sort)
      .populate('reviews')
      .select('-__v');

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    category: req.body.category,
    quantity: req.body.quantity,
    availableQuantity: req.body.quantity,
    location: req.body.location
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.remove();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = new Review({
      user: req.user._id,
      book: book._id,
      rating,
      comment
    });

    await review.save();
    book.reviews.push(review._id);
    
    // Update average rating
    const allReviews = await Review.find({ book: book._id });
    const avgRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0) / allReviews.length;
    book.averageRating = avgRating;
    
    await book.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 