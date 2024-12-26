import { useState, useEffect } from 'react';
import {
  MenuBook,
  AccessTime,
  Warning,
  Search,
  History,
  Bookmark,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const BookCard = ({ book }) => {
  if (!book) return null;
  
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
          </div>
        </div>
        {book.isOverdue && (
          <div className="w-8 h-8 rounded-full bg-accent-danger/10 flex items-center justify-center">
            <Warning className="text-accent-danger" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
        <AccessTime className="text-sm" />
        <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    borrowedBooks: [],
    recentlyViewed: []
  });
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/dashboard');
        setDashboardData({
          borrowedBooks: response.data.borrowedBooks || [],
          recentlyViewed: response.data.recentlyViewed || []
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h1>
        <p className="text-text-secondary">
          Here's an overview of your library activity
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/books')}
          className="card card-hover p-6 text-left"
        >
          <Search className="text-accent-primary mb-2" />
          <h3 className="font-medium">Browse Books</h3>
          <p className="text-sm text-text-secondary mt-1">
            Explore our collection
          </p>
        </button>
        <button
          onClick={() => navigate('/my-books')}
          className="card card-hover p-6 text-left"
        >
          <Bookmark className="text-accent-success mb-2" />
          <h3 className="font-medium">My Books</h3>
          <p className="text-sm text-text-secondary mt-1">
            View borrowed books
          </p>
        </button>
        <button
          onClick={() => navigate('/history')}
          className="card card-hover p-6 text-left"
        >
          <History className="text-accent-secondary mb-2" />
          <h3 className="font-medium">History</h3>
          <p className="text-sm text-text-secondary mt-1">
            Past borrowings
          </p>
        </button>
      </div>

      {/* Current Loans */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Currently Borrowed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardData.borrowedBooks && dashboardData.borrowedBooks.length > 0 ? (
            dashboardData.borrowedBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          ) : (
            <p className="text-text-secondary">No books currently borrowed</p>
          )}
        </div>
      </div>

      {/* Recently Viewed */}
      {dashboardData.recentlyViewed && dashboardData.recentlyViewed.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.recentlyViewed.map((book) => (
              <div
                key={book._id}
                className="p-4 rounded-lg bg-background-tertiary hover:bg-background-tertiary/80 transition-colors cursor-pointer"
                onClick={() => navigate(`/books/${book._id}`)}
              >
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard; 