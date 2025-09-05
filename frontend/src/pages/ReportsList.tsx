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
import { reportsApi, Report, QueryParams } from '../services/api';

const ReportsList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchReports = async (params: QueryParams = {}) => {
    try {
      setLoading(true);
      const response = await reportsApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        ...params,
      });
      setReports(response.data.data);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
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
        await reportsApi.delete(id);
        fetchReports();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/reports/new')}
        >
          New Report
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        <Box p={2}>
          <TextField
            fullWidth
            placeholder="Search reports by report number, customer, or inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Inspector</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Report Date</TableCell>
              <TableCell>Details Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {report.reportNo}
                  </Typography>
                </TableCell>
                <TableCell>{report.customer || '-'}</TableCell>
                <TableCell>{report.inspector || '-'}</TableCell>
                <TableCell>
                  {report.product && (
                    <Chip label={report.product} size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>{formatDate(report.reportDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={report.reportDetails?.length || 0}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/reports/${report.id}`)}
                    title="View"
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/reports/${report.id}/edit`)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(report.id!)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ReportsList;
