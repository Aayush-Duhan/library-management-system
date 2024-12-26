import { useState, useEffect } from 'react';
import {
  MenuBook,
  People,
  SwapHoriz,
  Warning,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const StatCard = ({ title, value, icon: Icon, trend, color, secondaryValue }) => (
  <div className="card card-hover p-6 relative overflow-hidden">
    <div className="flex justify-between">
      <div>
        <p className="text-text-secondary text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {secondaryValue && (
          <p className="text-text-secondary text-sm mt-1">{secondaryValue}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 text-accent-success mt-2">
            <TrendingUp className="text-sm" />
            <span className="text-sm">{trend}% increase</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}/10`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activity }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-background-tertiary rounded-lg transition-colors">
    <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
      <activity.icon className="text-accent-primary" />
    </div>
    <div>
      <p className="font-medium">{activity.title}</p>
      <p className="text-sm text-text-secondary">{activity.time}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    activeLoans: 0,
    overdueBooks: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.stats);
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={MenuBook}
          color="text-accent-primary"
          secondaryValue="In collection"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={People}
          color="text-accent-success"
          trend={12}
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={SwapHoriz}
          color="text-accent-warning"
        />
        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={Warning}
          color="text-accent-danger"
          secondaryValue="Needs attention"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/admin/books')}
                className="p-4 rounded-lg bg-background-tertiary hover:bg-accent-primary/10 transition-colors"
              >
                <MenuBook className="text-accent-primary mb-2" />
                <h3 className="font-medium">Manage Books</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Add, edit, or remove books
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="p-4 rounded-lg bg-background-tertiary hover:bg-accent-success/10 transition-colors"
              >
                <People className="text-accent-success mb-2" />
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-text-secondary mt-1">
                  View and manage user accounts
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/loans')}
                className="p-4 rounded-lg bg-background-tertiary hover:bg-accent-warning/10 transition-colors"
              >
                <SwapHoriz className="text-accent-warning mb-2" />
                <h3 className="font-medium">Manage Loans</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Track book loans and returns
                </p>
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="p-4 rounded-lg bg-background-tertiary hover:bg-accent-secondary/10 transition-colors"
              >
                <Assessment className="text-accent-secondary mb-2" />
                <h3 className="font-medium">Reports</h3>
                <p className="text-sm text-text-secondary mt-1">
                  View system analytics
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {activities.map((activity, index) => (
              <RecentActivity key={index} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 