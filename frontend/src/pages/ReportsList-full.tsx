import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TablePagination,
  IconButton,
  Chip,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface ReportDetail {
  id?: number;
  actualDensity?: string;
  zdnmt?: string;
  densityAt20c?: string;
  differenceAmberRwbmt?: string;
  differenceAmberRwbmtPercent?: string;
  dipCm?: string;
  govLiters?: number;
  rtcNo?: string;
  rwbmtGross?: string;
  rwbNo?: string;
  sealNo?: string;
  tovLiters?: number;
  temperatureC?: string;
  type?: string;
  waterLiters?: number;
  waterCm?: string;
}

interface Report {
  id?: number;
  contractNo?: string;
  customer?: string;
  dischargeCommenced?: string;
  dischargeCompleted?: string;
  fullCompleted?: string;
  handledBy?: string;
  inspector?: string;
  location?: string;
  object?: string;
  product?: string;
  reportDate?: string;
  reportNo: string;
  reportDetails: ReportDetail[];
  createdAt?: string;
  updatedAt?: string;
}

interface ReportsResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ReportsList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'n':
            event.preventDefault();
            navigate('/reports/new');
            break;
          case 'f':
            event.preventDefault();
            (document.querySelector('input[placeholder*="Search"]') as HTMLInputElement)?.focus();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const fetchReports = async (params: any = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(search && { search }),
        ...params,
      });

      const response = await fetch(`http://localhost:3001/api/reports?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data: ReportsResponse = await response.json();
      setReports(data.data);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    fetchReports({ search });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/reports/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete report');
        }

        fetchReports();
      } catch (err: any) {
        setError(err.message || 'Failed to delete report');
      }
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && reports.length === 0) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <CircularProgress size={60} sx={{ color: '#667eea' }} />
          <Typography variant="h6" color="text.secondary">
            Loading reports...
          </Typography>
        </Box>
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
        <Box>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            }}
          >
            Measurement Reports
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
          >
            Professional report management system
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              mt: 1,
              display: 'block',
            }}
          >
            💡 Keyboard shortcuts: Ctrl+N (New Report), Ctrl+F (Search)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reports/new')}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          New Report
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper 
        elevation={8}
        sx={{ 
          mb: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box p={3}>
          <TextField
            fullWidth
            placeholder="Search reports by report number, customer, or inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#667eea' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
            }}
          />
        </Box>
      </Paper>

      <TableContainer 
        component={Paper}
        elevation={8}
        sx={{ 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Report No</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Inspector</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Report Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Details Count</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: '#667eea' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow 
                key={report.id} 
                hover
                sx={{ 
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'rgba(102, 126, 234, 0.02)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    transform: 'scale(1.01)',
                    transition: 'all 0.2s ease',
                  },
                }}
              >
                <TableCell>
                  <Typography 
                    variant="body2" 
                    fontWeight="600"
                    sx={{ color: '#667eea' }}
                  >
                    {report.reportNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {report.customer || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {report.inspector || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {report.product && (
                    <Chip 
                      label={report.product} 
                      size="small" 
                      variant="outlined"
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(report.reportDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={report.reportDetails?.length || 0}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/reports/${report.id}`)}
                    title="View"
                    sx={{
                      color: '#667eea',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/reports/${report.id}/edit`)}
                    title="Edit"
                    sx={{
                      color: '#667eea',
                      '&:hover': {
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(report.id!)}
                    title="Delete"
                    sx={{
                      color: '#dc3545',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {reports.length === 0 && !loading && (
        <Paper 
          elevation={8}
          sx={{ 
            mt: 3,
            p: 6,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No Reports Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {search ? 'No reports match your search criteria.' : 'Get started by creating your first report.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/reports/new')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create First Report
          </Button>
        </Paper>
      )}

      <Paper 
        elevation={8}
        sx={{ 
          mt: 3,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              color: '#667eea',
              fontWeight: 600,
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: '#667eea',
              fontWeight: 600,
            },
            '& .MuiIconButton-root': {
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              },
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ReportsList;
