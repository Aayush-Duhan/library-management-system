import { useState, useEffect } from 'react';
import {
  MenuBook,
  People,
  SwapHoriz,
  Warning,
  TrendingUp,
  AccessTime,
  Search,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

// Admin Components
const AdminStatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="card card-hover p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 text-accent-success mt-2">
            <TrendingUp className="text-sm" />
            <span className="text-sm">{trend}% this month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}/10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  </div>
);

// User Components
const UserStatCard = ({ title, value, icon: Icon, color }) => (
  <div className="card card-hover p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}/10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  </div>
);

const BorrowedBookCard = ({ book }) => {
  console.log('Book data in card:', book); // For debugging
  const dueDate = new Date(book.dueDate);
  const borrowDate = new Date(book.borrowDate);
  const isOverdue = book.isOverdue;
  const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card card-hover p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
          <MenuBook className="text-accent-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{book.title}</h3>
          <p className="text-sm text-text-secondary">{book.author}</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <AccessTime className="text-sm text-accent-primary" />
              <span className="text-sm text-text-secondary">
                Borrowed on: {borrowDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AccessTime className={`text-sm ${isOverdue ? 'text-accent-danger' : 'text-accent-warning'}`} />
              <span className="text-sm text-text-secondary">
                Due: {dueDate.toLocaleDateString()}
                {!isOverdue && ` (${daysLeft} days left)`}
                {isOverdue && ` (${Math.abs(daysLeft)} days overdue)`}
              </span>
            </div>
          </div>
        </div>
        {isOverdue && (
          <div className="w-8 h-8 rounded-full bg-accent-danger/10 flex items-center justify-center">
            <Warning className="text-accent-danger" />
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    stats: {
      currentlyBorrowed: 0,
      totalBorrowed: 0,
      overdueBooks: 0
    },
    borrowedBooks: [],
    recentActivity: []
  });
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const isAdmin = userRole === 'admin';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/admin/dashboard' : '/users/dashboard';
      const response = await api.get(endpoint);
      setData({
        stats: response.data.stats || {},
        borrowedBooks: response.data.borrowedBooks || [],
        recentActivity: response.data.recentActivity || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">
            Overview of your library management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard
            title="Total Books"
            value={data?.stats.totalBooks || 0}
            icon={MenuBook}
            color="text-accent-primary"
            trend={5}
          />
          <AdminStatCard
            title="Active Users"
            value={data?.stats.activeUsers || 0}
            icon={People}
            color="text-accent-success"
          />
          <AdminStatCard
            title="Active Loans"
            value={data?.stats.activeLoans || 0}
            icon={SwapHoriz}
            color="text-accent-warning"
          />
          <AdminStatCard
            title="Overdue Books"
            value={data?.stats.overdueBooks || 0}
            icon={Warning}
            color="text-accent-danger"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/books')}
            className="card card-hover p-6 text-left"
          >
            <MenuBook className="text-accent-primary mb-2" />
            <h3 className="font-medium">Manage Books</h3>
            <p className="text-sm text-text-secondary mt-1">
              Add, edit, or remove books
            </p>
          </button>
          <button
            onClick={() => navigate('/admin/users')}
            className="card card-hover p-6 text-left"
          >
            <People className="text-accent-success mb-2" />
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-text-secondary mt-1">
              View and manage user accounts
            </p>
          </button>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="card card-hover p-6 text-left"
          >
            <SwapHoriz className="text-accent-warning mb-2" />
            <h3 className="font-medium">Transactions</h3>
            <p className="text-sm text-text-secondary mt-1">
              View all book transactions
            </p>
          </button>
        </div>
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

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserStatCard
          title="Currently Borrowed"
          value={data?.stats?.currentlyBorrowed || 0}
          icon={MenuBook}
          color="text-accent-primary"
        />
        <UserStatCard
          title="Total Borrowed"
          value={data?.stats?.totalBorrowed || 0}
          icon={History}
          color="text-accent-success"
        />
        <UserStatCard
          title="Overdue Books"
          value={data?.stats?.overdueBooks || 0}
          icon={Warning}
          color="text-accent-danger"
        />
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
          <MenuBook className="text-accent-success mb-2" />
          <h3 className="font-medium">My Books</h3>
          <p className="text-sm text-text-secondary mt-1">
            Manage borrowed books
          </p>
        </button>
        <button
          onClick={() => navigate('/history')}
          className="card card-hover p-6 text-left"
        >
          <History className="text-accent-warning mb-2" />
          <h3 className="font-medium">History</h3>
          <p className="text-sm text-text-secondary mt-1">
            View borrowing history
          </p>
        </button>
      </div>

      {/* Current Loans */}
      {Array.isArray(data.borrowedBooks) && data.borrowedBooks.length > 0 ? (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Currently Borrowed</h2>
            <button
              onClick={() => navigate('/my-books')}
              className="text-accent-primary hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {data.borrowedBooks.map((book) => (
              <BorrowedBookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="text-center text-text-secondary">
            <p>You haven't borrowed any books yet.</p>
            <button
              onClick={() => navigate('/books')}
              className="btn btn-primary mt-4"
            >
              Browse Books
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {Array.isArray(data.recentActivity) && data.recentActivity.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-accent-primary hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {data.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-background-tertiary rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <SwapHoriz className="text-accent-primary" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-text-secondary">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 