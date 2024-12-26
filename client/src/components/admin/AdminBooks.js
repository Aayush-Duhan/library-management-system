import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <AddIcon /> Add New Book
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">ISBN</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-white/5">
                  <td className="p-4">{book.title}</td>
                  <td className="p-4">{book.author}</td>
                  <td className="p-4">{book.isbn}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      book.available ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-danger/10 text-accent-danger'
                    }`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg">
                        <EditIcon className="text-accent-primary" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg">
                        <DeleteIcon className="text-accent-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooks; 