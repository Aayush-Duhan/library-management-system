import { useState, useEffect, useRef } from 'react';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import api from '../../utils/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState({ upcomingDue: [], overdue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(null);
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 relative"
      >
        <NotificationsIcon />
        {!error && (notifications.upcomingDue.length > 0 || notifications.overdue.length > 0) && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-danger rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-background-secondary rounded-lg shadow-lg border border-white/10 z-50">
          <div className="p-4">
            <h3 className="font-semibold mb-2">Notifications</h3>
            {loading ? (
              <p className="text-sm text-text-secondary">Loading...</p>
            ) : error ? (
              <p className="text-sm text-accent-danger">{error}</p>
            ) : (
              <div className="space-y-4">
                {notifications.overdue.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-accent-danger">Overdue Books</h4>
                    {notifications.overdue.map((item, index) => (
                      <div key={index} className="text-sm p-2 bg-accent-danger/10 rounded">
                        <p className="font-medium">{item.bookTitle}</p>
                        <p className="text-xs text-text-secondary">
                          {item.daysOverdue} days overdue
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {notifications.upcomingDue.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-accent-warning">Due Soon</h4>
                    {notifications.upcomingDue.map((item, index) => (
                      <div key={index} className="text-sm p-2 bg-accent-warning/10 rounded">
                        <p className="font-medium">{item.bookTitle}</p>
                        <p className="text-xs text-text-secondary">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {notifications.upcomingDue.length === 0 && notifications.overdue.length === 0 && (
                  <p className="text-sm text-text-secondary">No notifications</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 