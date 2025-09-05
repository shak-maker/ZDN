import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Measurement Reports System
        </Typography>
        <Typography variant="h6" gutterBottom>
          Testing with Material UI only...
        </Typography>
        <Button variant="contained" color="primary">
          Test Button
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;
