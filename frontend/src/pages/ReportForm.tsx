import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { reportsApi, Report, ReportDetail } from '../services/api';

const ReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Report>>({
    contractNo: '',
    customer: '',
    dischargeCommenced: '',
    dischargeCompleted: '',
    fullCompleted: '',
    handledBy: '',
    inspector: '',
    location: '',
    object: '',
    product: '',
    reportDate: '',
    reportNo: '',
    reportDetails: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jsonPreview, setJsonPreview] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchReport(parseInt(id));
    }
  }, [id, isEdit]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const response = await reportsApi.getById(reportId);
      setFormData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Report, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (field: keyof Report, value: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ? value.toISOString() : '',
    }));
  };

  const addDetailRow = () => {
    const newDetail: ReportDetail = {
      actualDensity: '',
      zdnmt: '',
      densityAt20c: '',
      differenceAmberRwbmt: '',
      differenceAmberRwbmtPercent: '',
      dipCm: '',
      govLiters: 0,
      rtcNo: '',
      rwbmtGross: '',
      rwbNo: '',
      sealNo: '',
      tovLiters: 0,
      temperatureC: '',
      type: '',
      waterLiters: 0,
      waterCm: '',
    };

    setFormData(prev => ({
      ...prev,
      reportDetails: [...(prev.reportDetails || []), newDetail],
    }));
  };

  const removeDetailRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reportDetails: prev.reportDetails?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateDetailField = (index: number, field: keyof ReportDetail, value: any) => {
    setFormData(prev => ({
      ...prev,
      reportDetails: prev.reportDetails?.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      ) || [],
    }));
  };

  const generateJsonPreview = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/reports/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const jsonData = await response.json();
        setJsonPreview(JSON.stringify(jsonData, null, 2));
        setPreviewOpen(true);
      } else {
        // Fallback: generate preview locally
        const canonicalJson = {
          Message: '',
          SendDate: new Date().toISOString(),
          Success: true,
          Hemjilt: {
            ContractNo: formData.contractNo || '',
            Customer: formData.customer || '',
            DischargeCommenced: formData.dischargeCommenced ? dayjs(formData.dischargeCommenced).format('YYYY-MM-DD HH:mm:ss') : '',
            DischargeCompleted: formData.dischargeCompleted ? dayjs(formData.dischargeCompleted).format('YYYY-MM-DD HH:mm:ss') : '',
            FullCompleted: formData.fullCompleted ? dayjs(formData.fullCompleted).format('YYYY-MM-DD HH:mm:ss') : '',
            HandledBy: formData.handledBy || '',
            Inspector: formData.inspector || '',
            Location: formData.location || '',
            Object: formData.object || '',
            Product: formData.product || '',
            ReportDate: formData.reportDate ? dayjs(formData.reportDate).format('YYYY-MM-DD') : '',
            ReportNo: formData.reportNo || '',
            HemjiltDetails: (formData.reportDetails || []).map(detail => ({
              ActualDensity: detail.actualDensity || '0',
              ZDNMT: detail.zdnmt || '0',
              DensityAt20c: detail.densityAt20c || '0',
              DiffrenceAmberRWBMT: detail.differenceAmberRwbmt || '0',
              DiffrenceAmberRWBMTProcent: detail.differenceAmberRwbmtPercent || '0',
              DipSm: detail.dipCm || '0',
              GOVLtr: detail.govLiters?.toString() || '0',
              RTCNo: detail.rtcNo || '',
              RWBMTGross: detail.rwbmtGross || '0',
              RWBNo: detail.rwbNo || '',
              SealNo: detail.sealNo || '',
              TOVltr: detail.tovLiters?.toString() || '0',
              Temprature: detail.temperatureC || '0',
              Type: detail.type || '',
              WaterLtr: detail.waterLiters?.toString() || '0',
              WaterSm: detail.waterCm || '0',
            })),
          },
        };
        setJsonPreview(JSON.stringify(canonicalJson, null, 2));
        setPreviewOpen(true);
      }
    } catch (err) {
      console.error('Error generating preview:', err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.reportNo) {
      setError('Report number is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isEdit && id) {
        await reportsApi.update(parseInt(id), formData);
      } else {
        await reportsApi.create(formData as Report);
      }

      navigate('/reports');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
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
          {isEdit ? 'Edit Report' : 'New Report'}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={generateJsonPreview}
            sx={{ mr: 1 }}
          >
            Preview JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/reports')}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Report Number *"
              value={formData.reportNo || ''}
              onChange={(e) => handleInputChange('reportNo', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer"
              value={formData.customer || ''}
              onChange={(e) => handleInputChange('customer', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contract Number"
              value={formData.contractNo || ''}
              onChange={(e) => handleInputChange('contractNo', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product"
              value={formData.product || ''}
              onChange={(e) => handleInputChange('product', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Inspector"
              value={formData.inspector || ''}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Handled By"
              value={formData.handledBy || ''}
              onChange={(e) => handleInputChange('handledBy', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Object"
              value={formData.object || ''}
              onChange={(e) => handleInputChange('object', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Report Date"
              value={formData.reportDate ? dayjs(formData.reportDate) : null}
              onChange={(value) => handleDateChange('reportDate', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DateTimePicker
              label="Discharge Commenced"
              value={formData.dischargeCommenced ? dayjs(formData.dischargeCommenced) : null}
              onChange={(value) => handleDateChange('dischargeCommenced', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DateTimePicker
              label="Discharge Completed"
              value={formData.dischargeCompleted ? dayjs(formData.dischargeCompleted) : null}
              onChange={(value) => handleDateChange('dischargeCompleted', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Full Completed"
              value={formData.fullCompleted ? dayjs(formData.fullCompleted) : null}
              onChange={(value) => handleDateChange('fullCompleted', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Report Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addDetailRow}
            size="small"
          >
            Add Detail
          </Button>
        </Box>

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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(formData.reportDetails || []).map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.rtcNo || ''}
                      onChange={(e) => updateDetailField(index, 'rtcNo', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.rwbNo || ''}
                      onChange={(e) => updateDetailField(index, 'rwbNo', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.sealNo || ''}
                      onChange={(e) => updateDetailField(index, 'sealNo', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.type || ''}
                      onChange={(e) => updateDetailField(index, 'type', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.actualDensity || ''}
                      onChange={(e) => updateDetailField(index, 'actualDensity', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.zdnmt || ''}
                      onChange={(e) => updateDetailField(index, 'zdnmt', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.densityAt20c || ''}
                      onChange={(e) => updateDetailField(index, 'densityAt20c', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.temperatureC || ''}
                      onChange={(e) => updateDetailField(index, 'temperatureC', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.govLiters || ''}
                      onChange={(e) => updateDetailField(index, 'govLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.tovLiters || ''}
                      onChange={(e) => updateDetailField(index, 'tovLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.waterLiters || ''}
                      onChange={(e) => updateDetailField(index, 'waterLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => removeDetailRow(index)}
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
      </Paper>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>JSON Preview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is how the report will be stored in the canonical JSON format:
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
            {jsonPreview}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportForm;
