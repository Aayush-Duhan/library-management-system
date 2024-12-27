import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBooks from './components/admin/AdminBooks';
import AdminUsers from './components/admin/AdminUsers';
import AdminLoans from './components/admin/AdminLoans';
import AdminReports from './components/admin/AdminReports';

// User Components
import UserDashboard from './components/user/UserDashboard';
import Books from './components/pages/Books';
import MyBooks from './components/user/MyBooks';
import History from './components/user/History';

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
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="books" element={<AdminBooks />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="loans" element={<AdminLoans />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="dashboard" element={<UserDashboard />} />
                      <Route path="books" element={<Books />} />
                      <Route path="my-books" element={<MyBooks />} />
                      <Route path="history" element={<History />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Root redirect */}
            <Route
              path="/"
              element={
                <Navigate
                  to={localStorage.getItem('userRole') === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  replace
                />
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
