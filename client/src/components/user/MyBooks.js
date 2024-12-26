import { useState, useEffect } from 'react';
import {
  MenuBook,
  AccessTime,
  Warning as WarningIcon,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const BookCard = ({ book, onReturn }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReturn = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Attempting to return book:', book);
      await onReturn(book.transactionId);
    } catch (error) {
      console.error('Return error details:', {
        transactionId: book.transactionId,
        error: error.response?.data || error.message
      });
      setError(error.response?.data?.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  const dueDate = new Date(book.dueDate);
  const isOverdue = book.isOverdue;
  const borrowDate = new Date(book.borrowDate);

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
            <MenuBook className="text-accent-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-text-secondary">{book.author}</p>
            <p className="text-sm text-text-secondary mt-1">ISBN: {book.isbn}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <AccessTime className="text-sm text-accent-primary" />
                <span>Borrowed: {borrowDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AccessTime className={`text-sm ${isOverdue ? 'text-accent-danger' : 'text-accent-warning'}`} />
                <span>Due: {dueDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        {isOverdue && (
          <div className="w-8 h-8 rounded-full bg-accent-danger/10 flex items-center justify-center">
            <WarningIcon className="text-accent-danger" />
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 text-sm text-accent-danger">
          {error}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReturn}
          disabled={loading}
          className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Returning...' : 'Return Book'}
        </button>
      </div>
    </div>
  );
};

const MyBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions/my-books');
      console.log('Fetched books:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch your borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      console.log('Returning transaction with ID:', transactionId);
      const response = await api.put(`/transactions/return/${transactionId}`);
      console.log('Return response:', response.data);
      
      if (response.data.message) {
        await fetchMyBooks();
      }
    } catch (error) {
      console.error('Error returning book:', error.response?.data || error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading your books...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Borrowed Books</h1>
          <p className="text-text-secondary">
            Manage your borrowed books and returns
          </p>
        </div>
        <button
          onClick={() => navigate('/books')}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowBack />
          Browse Books
        </button>
      </div>

      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onReturn={handleReturn}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-background-secondary rounded-lg">
            <p className="text-text-secondary">You haven't borrowed any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="btn btn-primary mt-4"
            >
              Browse Available Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks; 