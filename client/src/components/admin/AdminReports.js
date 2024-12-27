import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import {
  TrendingUp,
  MenuBook,
  People,
  Warning
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="card p-6">
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

const AdminReports = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    overdueLoans: 0,
    popularBooks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reports');
        setStats(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Reports</h1>
        <p className="text-text-secondary">Library system analytics and reports</p>
      </div>

      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Loans"
          value={stats.totalLoans}
          icon={MenuBook}
          color="text-accent-primary"
          trend={12}
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={People}
          color="text-accent-success"
        />
        <StatCard
          title="Overdue Loans"
          value={stats.overdueLoans}
          icon={Warning}
          color="text-accent-danger"
        />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Popular Books</h2>
        <div className="space-y-4">
          {stats.popularBooks.map((book, index) => (
            <div
              key={book._id}
              className="flex items-center justify-between p-4 bg-background-tertiary rounded-lg"
            >
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-text-secondary">
                  by {book.author}
                </p>
              </div>
              <div className="text-accent-primary font-medium">
                {book.loanCount} loans
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports; 