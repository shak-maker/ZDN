import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import Logo from '../components/Logo';

interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await authApi.getUsers();
      const usersData = response.data;
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setSubmitting(true);
      setError('');

      await authApi.register(newUser.username, '', newUser.password);

      setDialogOpen(false);
      setNewUser({ username: '', fullName: '', password: '' });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.2))',
            }}
          >
            <Logo 
              size={80} 
              variant="gradient"
            />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              }}
            >
              User Management
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                fontWeight: 400,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              Manage team members and access
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)',
              boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #6b21a8 100%)',
                boxShadow: '0 12px 40px rgba(30, 58, 138, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
            sx={{
              borderColor: '#6c757d',
              color: '#6c757d',
              '&:hover': {
                borderColor: '#5a6268',
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
              },
            }}
          >
            Back to Reports
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={8}
        sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(30, 58, 138, 0.05)' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Full Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id}
                  hover
                  sx={{ 
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(30, 58, 138, 0.02)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(30, 58, 138, 0.08)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {user.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        backgroundColor: user.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 58, 138, 0.1)',
                        color: user.role === 'ADMIN' ? '#dc2626' : '#1e3a8a',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: user.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: user.isActive ? '#16a34a' : '#dc2626',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Team Member</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              margin="normal"
              required
              helperText="Minimum 6 characters"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            disabled={submitting || !newUser.username || !newUser.fullName || !newUser.password}
          >
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
