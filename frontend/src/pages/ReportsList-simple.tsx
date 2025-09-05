import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const ReportsList: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports List
      </Typography>
      <Typography variant="h6" gutterBottom>
        This is a simple version of the reports list page.
      </Typography>
      <Button variant="contained" color="primary">
        New Report
      </Button>
    </Box>
  );
};

export default ReportsList;
