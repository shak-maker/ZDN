import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
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

const ReportViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport(parseInt(id));
    }
  }, [id]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const report: Report = await response.json();
      setReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const downloadJson = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `report_${report.reportNo}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Report not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reports')}
        >
          Back to Reports
        </Button>
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
            Report: {report.reportNo}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
          >
            View and manage measurement report details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CodeIcon />}
            onClick={() => setJsonDialogOpen(true)}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a6fd8',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            View JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadJson}
            sx={{
              borderColor: '#28a745',
              color: '#28a745',
              '&:hover': {
                borderColor: '#218838',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
              },
            }}
          >
            Download JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/reports/${report.id}/edit`)}
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
            Edit
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
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={8}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#667eea',
                mb: 3,
              }}
            >
              Report Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Report Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {report.reportNo}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1">
                  {report.customer || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Contract Number
                </Typography>
                <Typography variant="body1">
                  {report.contractNo || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="body1">
                  {report.product ? (
                    <Chip label={report.product} size="small" variant="outlined" />
                  ) : '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Inspector
                </Typography>
                <Typography variant="body1">
                  {report.inspector || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Handled By
                </Typography>
                <Typography variant="body1">
                  {report.handledBy || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {report.location || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Object
                </Typography>
                <Typography variant="body1">
                  {report.object || '-'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Report Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.reportDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Discharge Commenced
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.dischargeCommenced)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Discharge Completed
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.dischargeCompleted)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Full Completed
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.fullCompleted)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper 
            elevation={8}
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#667eea',
                mb: 3,
              }}
            >
              Report Details ({report.reportDetails?.length || 0} items)
            </Typography>
            {report.reportDetails && report.reportDetails.length > 0 ? (
              <TableContainer
                sx={{
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>RTC No</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>RWB No</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Seal No</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Actual Density</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>ZDNMT</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Density @ 20°C</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Temperature</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>GOV (L)</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>TOV (L)</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#667eea' }}>Water (L)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.reportDetails.map((detail, index) => (
                      <TableRow 
                        key={index}
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
                          <Typography variant="body2" fontWeight="medium">
                            {detail.rtcNo || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {detail.rwbNo || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {detail.sealNo || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {detail.type || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.actualDensity || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.zdnmt || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.densityAt20c || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.temperatureC || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.govLiters || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.tovLiters || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {detail.waterLiters || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">
                No details available for this report.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            elevation={8}
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: '#667eea',
                  mb: 3,
                }}
              >
                Report Summary
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.createdAt)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {formatDate(report.updatedAt)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Total Details
                </Typography>
                <Typography variant="body1">
                  {report.reportDetails?.length || 0}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Total GOV (L)
                </Typography>
                <Typography variant="body1">
                  {report.reportDetails?.reduce((sum, detail) => sum + (detail.govLiters || 0), 0) || 0}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Total TOV (L)
                </Typography>
                <Typography variant="body1">
                  {report.reportDetails?.reduce((sum, detail) => sum + (detail.tovLiters || 0), 0) || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={jsonDialogOpen} onClose={() => setJsonDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Report JSON Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is the complete JSON data for this report:
          </DialogContentText>
          <Divider sx={{ my: 2 }} />
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '0.875rem',
            }}
          >
            {JSON.stringify(report, null, 2)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonDialogOpen(false)}>Close</Button>
          <Button onClick={downloadJson} startIcon={<DownloadIcon />}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportViewer;
