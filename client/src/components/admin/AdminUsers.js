import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import {
  Person as PersonIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Joined Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center">
                      <PersonIcon className="text-accent-primary" />
                    </div>
                    {user.name}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-accent-secondary/10 text-accent-secondary'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg">
                      {user.active ? (
                        <BlockIcon className="text-accent-danger" />
                      ) : (
                        <CheckCircleIcon className="text-accent-success" />
                      )}
                    </button>
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

export default AdminUsers; 