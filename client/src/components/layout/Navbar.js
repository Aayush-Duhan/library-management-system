import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  MenuBook,
  Person,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import Notifications from '../common/Notifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-background-secondary border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <MenuBook className="text-accent-primary text-2xl" />
              <span className="font-bold text-lg">Library System</span>
            </Link>
            
            {/* Desktop Navigation */}
            {user && (
              <div className="hidden md:flex ml-10 space-x-4">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/books" className="nav-link">Books</Link>
                <Link to="/my-books" className="nav-link">My Books</Link>
                <Link to="/history" className="nav-link">History</Link>
              </div>
            )}
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <Notifications />
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-sm text-text-secondary">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                  >
                    Logout
                  </button>
                </div>
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-md hover:bg-white/10"
                >
                  <MenuIcon />
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && user && (
          <div className="md:hidden py-2 space-y-1">
            <Link to="/dashboard" className="mobile-nav-link">Dashboard</Link>
            <Link to="/books" className="mobile-nav-link">Books</Link>
            <Link to="/my-books" className="mobile-nav-link">My Books</Link>
            <Link to="/history" className="mobile-nav-link">History</Link>
            <button
              onClick={handleLogout}
              className="w-full text-left mobile-nav-link text-accent-danger"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 