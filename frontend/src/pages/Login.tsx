import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Avatar,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext-basic';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      console.log('Login successful, navigating to /reports...');
      navigate('/reports');
    } catch (error) {
      console.log('Login failed:', error);
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 3, md: 4 },
        width: '100vw',
        margin: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: { xs: '100%', sm: '500px', md: '600px' },
        }}
      >
        <Paper
          elevation={24}
          sx={{
            padding: { xs: 4, sm: 6, md: 8 },
            borderRadius: { xs: 2, sm: 3, md: 4 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '100%',
            maxWidth: { xs: '100%', sm: '500px', md: '600px' },
            minHeight: { xs: 'auto', sm: '600px', md: '700px' },
          }}
        >
          {/* Logo and Title Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: { xs: 3, sm: 4, md: 5 },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 60, sm: 80, md: 100 },
                height: { xs: 60, sm: 80, md: 100 },
                mb: { xs: 1.5, sm: 2, md: 3 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              }}
            >
              <AssessmentIcon sx={{ 
                fontSize: { xs: 30, sm: 40, md: 50 }, 
                color: 'white' 
              }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
              }}
            >
              ZDN
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ 
                textAlign: 'center', 
                fontWeight: 400,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              Report Management System
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  }
                }}
              >
                {error}
              </Alert>
            )}

            {/* Username Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username or Email"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ 
                    color: 'text.secondary', 
                    mr: 1,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                  }} />
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  minHeight: { xs: '48px', sm: '56px' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <LockIcon sx={{ 
                    color: 'text.secondary', 
                    mr: 1,
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                  }} />
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  minHeight: { xs: '48px', sm: '56px' },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#667eea',
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                },
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 3,
                py: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                fontWeight: 600,
                textTransform: 'none',
                minHeight: { xs: '48px', sm: '56px' },
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>


            {/* Footer Links */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, sm: 3 },
                mt: 2,
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                Need Help?
              </Link>
            </Box>
          </Box>
        </Paper>

      </Box>
    </Box>
  );
};

export default Login;
