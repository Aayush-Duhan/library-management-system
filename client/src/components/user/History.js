import { useState, useEffect } from 'react';
import {
  MenuBook,
  AccessTime,
  Warning as WarningIcon,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const TransactionCard = ({ transaction }) => {
  const { book, status, borrowDate, returnDate, dueDate, isOverdue } = transaction;

  return (
    <div className="card p-6">
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
                <span>Borrowed: {new Date(borrowDate).toLocaleDateString()}</span>
              </div>
              {status === 'returned' ? (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="text-sm text-accent-success" />
                  <span>Returned: {new Date(returnDate).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <AccessTime className={`text-sm ${isOverdue ? 'text-accent-danger' : 'text-accent-warning'}`} />
                  <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          status === 'returned' 
            ? 'bg-accent-success/10 text-accent-success' 
            : isOverdue 
              ? 'bg-accent-danger/10 text-accent-danger'
              : 'bg-accent-warning/10 text-accent-warning'
        }`}>
          {status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Borrowed'}
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/transactions/history');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
        setError('Failed to fetch transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading transaction history...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Transaction History</h1>
          <p className="text-text-secondary">
            View your past and current book transactions
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline flex items-center gap-2"
        >
          <ArrowBack />
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-accent-danger/10 text-accent-danger p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-background-secondary rounded-lg">
            <p className="text-text-secondary">No transaction history found.</p>
            <button
              onClick={() => navigate('/books')}
              className="btn btn-primary mt-4"
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 