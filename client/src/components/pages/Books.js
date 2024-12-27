import { useState, useEffect } from 'react';
import {
  MenuBook,
  Search,
  FilterList,
  AccessTime,
} from '@mui/icons-material';
import api from '../../utils/axios';

const BookCard = ({ book, onBorrow }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBorrow = async () => {
    try {
      setLoading(true);
      setError('');
      await onBorrow(book._id);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to borrow book');
      console.error('Error borrowing book:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{book.title}</h3>
          <p className="text-sm text-text-secondary mt-1">{book.author}</p>
          <p className="text-xs text-text-secondary mt-2">ISBN: {book.isbn}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            book.availableQuantity > 0 
              ? 'bg-accent-success/10 text-accent-success' 
              : 'bg-accent-danger/10 text-accent-danger'
          }`}>
            {book.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>
      {error && (
        <div className="mt-4 text-sm text-accent-danger">
          {error}
        </div>
      )}
      <button
        onClick={handleBorrow}
        disabled={loading || book.availableQuantity === 0}
        className="btn btn-primary w-full mt-4"
      >
        {loading ? 'Borrowing...' : 'Borrow Book'}
      </button>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post(`/transactions/borrow/${bookId}`);
      // Refresh the books list to update availability
      await fetchBooks();
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading books...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Library Books</h1>
        <p className="text-text-secondary">Browse and borrow books</p>
      </div>

      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={handleBorrow}
            />
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            No books found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Books; 