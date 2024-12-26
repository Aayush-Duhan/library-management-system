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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (book) => {
    if (book.availableQuantity === 0) {
      return 'bg-accent-danger/10 text-accent-danger';
    }
    if (book.availableQuantity < book.totalQuantity) {
      return 'bg-accent-warning/10 text-accent-warning';
    }
    return 'bg-accent-success/10 text-accent-success';
  };

  const getStatusText = (book) => {
    if (book.availableQuantity === 0) {
      return 'Not Available';
    }
    if (book.availableQuantity < book.totalQuantity) {
      return `${book.availableQuantity} of ${book.totalQuantity} Available`;
    }
    return 'Available';
  };

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <MenuBook className="text-accent-primary text-2xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="text-text-secondary">By {book.author}</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-sm text-text-secondary">ISBN: {book.isbn}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(book)}`}>
              {getStatusText(book)}
            </span>
          </div>
          {book.borrowers && book.borrowers.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-text-secondary">Next available:</p>
              <div className="flex items-center gap-2 text-sm">
                <AccessTime className="text-sm text-accent-primary" />
                <span>
                  {new Date(Math.min(...book.borrowers.map(b => new Date(b.dueDate)))).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="text-accent-danger text-sm mt-2">
            {error}
          </div>
        )}
        <button
          className={`btn btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleBorrow}
          disabled={book.availableQuantity === 0 || loading}
        >
          {loading ? 'Processing...' : 'Borrow'}
        </button>
      </div>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, available, borrowed
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all',
    sortBy: 'title'
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      setError('');
      const response = await api.post(`/transactions/borrow/${bookId}`);
      if (response.data) {
        // Refresh books list after borrowing
        await fetchBooks();
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      setError(error.response?.data?.message || 'Failed to borrow book. Please try again.');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    
    if (filter === 'available') return matchesSearch && book.availableQuantity > 0;
    if (filter === 'borrowed') return matchesSearch && book.availableQuantity < book.totalQuantity;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Browse Books</h1>
        <p className="text-text-secondary">
          Explore our collection and borrow books
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-10 pr-4 py-2 bg-background-tertiary rounded-lg border border-white/10 focus:border-accent-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FilterList className="text-text-secondary" />
          <select
            className="bg-background-tertiary rounded-lg border border-white/10 px-4 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Books</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>
      </div>

      {/* Filter options */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="form-select"
        >
          <option value="all">All Categories</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="science">Science</option>
          {/* Add more categories */}
        </select>

        <select 
          value={filters.availability}
          onChange={(e) => setFilters({...filters, availability: e.target.value})}
          className="form-select"
        >
          <option value="all">All Books</option>
          <option value="available">Available Now</option>
          <option value="borrowed">Currently Borrowed</option>
        </select>

        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          className="form-select"
        >
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>

      {/* Books Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading books...</div>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
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

      {/* Add error message display */}
      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Books; 