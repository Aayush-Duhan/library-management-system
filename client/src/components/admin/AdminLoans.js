import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import {
  SwapHoriz,
  Warning,
  CheckCircle,
  AccessTime
} from '@mui/icons-material';

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await api.get('/transactions');
        setLoans(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching loans:', error);
        setError('Failed to load loans');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const getLoanStatus = (loan) => {
    if (loan.status === 'returned') {
      return {
        icon: <CheckCircle className="text-accent-success" />,
        text: 'Returned',
        className: 'bg-accent-success/10 text-accent-success'
      };
    }
    if (new Date(loan.dueDate) < new Date()) {
      return {
        icon: <Warning className="text-accent-danger" />,
        text: 'Overdue',
        className: 'bg-accent-danger/10 text-accent-danger'
      };
    }
    return {
      icon: <AccessTime className="text-accent-warning" />,
      text: 'Borrowed',
      className: 'bg-accent-warning/10 text-accent-warning'
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading loans...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Manage Loans</h1>
        <p className="text-text-secondary">Track and manage book loans</p>
      </div>

      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Book</th>
                <th className="text-left p-4">Borrower</th>
                <th className="text-left p-4">Borrow Date</th>
                <th className="text-left p-4">Due Date</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loans.length > 0 ? (
                loans.map((loan) => {
                  const status = getLoanStatus(loan);
                  return (
                    <tr key={loan._id} className="hover:bg-white/5">
                      <td className="p-4">{loan.book.title}</td>
                      <td className="p-4">{loan.user.name}</td>
                      <td className="p-4">
                        {new Date(loan.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${status.className}`}>
                          {status.icon}
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-text-secondary">
                    No loans found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLoans; 