import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Books from './components/pages/Books';
import Users from './components/pages/Users';
import Transactions from './components/pages/Transactions';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBooks from './components/admin/AdminBooks';
import AdminUsers from './components/admin/AdminUsers';
import UserDashboard from './components/user/UserDashboard';
import MyBooks from './components/user/MyBooks';
import History from './components/user/History';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',
    },
    secondary: {
      main: '#8B5CF6',
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="books" element={<AdminBooks />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            {/* User Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="my-books" element={<MyBooks />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            {/* Redirect root to appropriate dashboard */}
            <Route path="/" element={
              <Navigate to={localStorage.getItem('userRole') === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
            } />

            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <History />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
