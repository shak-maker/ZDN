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
import { reportsApi, Report } from '../services/api';

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
      const response = await reportsApi.getById(reportId);
      setReport(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch report');
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Report: {report.reportNo}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<CodeIcon />}
            onClick={() => setJsonDialogOpen(true)}
            sx={{ mr: 1 }}
          >
            View JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadJson}
            sx={{ mr: 1 }}
          >
            Download JSON
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/reports/${report.id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
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

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report Details ({report.reportDetails?.length || 0} items)
            </Typography>
            {report.reportDetails && report.reportDetails.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>RTC No</TableCell>
                      <TableCell>RWB No</TableCell>
                      <TableCell>Seal No</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Actual Density</TableCell>
                      <TableCell>ZDNMT</TableCell>
                      <TableCell>Density @ 20°C</TableCell>
                      <TableCell>Temperature</TableCell>
                      <TableCell>GOV (L)</TableCell>
                      <TableCell>TOV (L)</TableCell>
                      <TableCell>Water (L)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.reportDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{detail.rtcNo || '-'}</TableCell>
                        <TableCell>{detail.rwbNo || '-'}</TableCell>
                        <TableCell>{detail.sealNo || '-'}</TableCell>
                        <TableCell>{detail.type || '-'}</TableCell>
                        <TableCell>{detail.actualDensity || '-'}</TableCell>
                        <TableCell>{detail.zdnmt || '-'}</TableCell>
                        <TableCell>{detail.densityAt20c || '-'}</TableCell>
                        <TableCell>{detail.temperatureC || '-'}</TableCell>
                        <TableCell>{detail.govLiters || '-'}</TableCell>
                        <TableCell>{detail.tovLiters || '-'}</TableCell>
                        <TableCell>{detail.waterLiters || '-'}</TableCell>
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
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
