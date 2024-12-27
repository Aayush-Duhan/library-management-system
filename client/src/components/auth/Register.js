import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await api.post('/users/register', formData);
      
      // Store the token and user role
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userName', response.data.name);
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-accent-danger/10 text-accent-danger p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-background-tertiary placeholder-text-secondary text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-background-secondary"
                placeholder="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-background-tertiary placeholder-text-secondary text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-background-secondary"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-background-tertiary placeholder-text-secondary text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-background-secondary"
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowAdminField(!showAdminField)}
                className="text-sm text-accent-primary hover:text-accent-primary/90"
              >
                {showAdminField ? 'Hide Admin Options' : 'Show Admin Options'}
              </button>
              {showAdminField && (
                <input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="mt-2 appearance-none rounded relative block w-full px-3 py-2 border border-background-tertiary placeholder-text-secondary text-text-primary focus:outline-none focus:ring-accent-primary focus:border-accent-primary sm:text-sm bg-background-secondary"
                  placeholder="Admin Code (optional)"
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-text-secondary">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-accent-primary hover:text-accent-primary/90"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 