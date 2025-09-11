import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportsApi } from '../services/api';
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
import dayjs, { Dayjs } from 'dayjs';

interface ReportDetail {
  id?: number;
  actualDensity?: string;
  zdnmt?: string;
  densityAt20c?: string;
  differenceZdnRwbmt?: string;
  differenceZdnRwbmtPercent?: string;
  dipSm?: string;
  govLiters?: number;
  rtcNo?: string;
  rwbmtGross?: string;
  rwbNo?: string;
  sealNo?: string;
  tovLiters?: number;
  temperatureC?: string;
  type?: string;
  waterLiters?: number;
  waterSm?: string;
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

const ReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
        },
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#667eea',
    },
  };

  const smallTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      minWidth: '120px', // Increased minimum width for better visibility
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
        },
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
  };

  const wideTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1,
      minWidth: '150px', // Even wider for fields that can have long values
      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
        },
      },
      '&.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#667eea',
          borderWidth: 2,
        },
      },
    },
  };

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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      fetchReport(parseInt(id));
    }
  }, [id, isEdit]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            handleSubmit();
            break;
          case 'p':
            event.preventDefault();
            generateJsonPreview();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const response = await reportsApi.getById(reportId);
      const canonicalData: any = response.data;
      
      // Convert canonical format to legacy format for form
      const report: Report = {
        contractNo: canonicalData.Hemjilt?.ContractNo,
        customer: canonicalData.Hemjilt?.Customer,
        dischargeCommenced: canonicalData.Hemjilt?.DischargeCommenced,
        dischargeCompleted: canonicalData.Hemjilt?.DischargeCompleted,
        fullCompleted: canonicalData.Hemjilt?.FullCompleted,
        handledBy: canonicalData.Hemjilt?.HandledBy,
        inspector: canonicalData.Inspector,
        location: canonicalData.Location,
        object: canonicalData.Object,
        product: canonicalData.Product,
        reportDate: canonicalData.ReportDate,
        reportNo: canonicalData.ReportNo,
        reportDetails: canonicalData.Hemjilt?.HemjiltDetails?.map((detail: any) => ({
          actualDensity: detail.ActualDensity,
          zdnmt: detail.ZDNMT,
          densityAt20c: detail.DensityAt20c,
          differenceZdnRwbmt: detail.DifferenceZdnRWBMT,
          differenceZdnRwbmtPercent: detail.DifferenceZdnRWBMTProcent,
          dipSm: detail.DipSm,
          govLiters: parseFloat(detail.GOVLtr) || 0,
          rtcNo: detail.RTCNo,
          rwbmtGross: detail.RWBMTGross,
          rwbNo: detail.RWBNo,
          sealNo: detail.SealNo,
          tovLiters: parseFloat(detail.TOVltr) || 0,
          temperatureC: detail.Temperature,
          type: detail.Type,
          waterLiters: parseFloat(detail.WaterLtr) || 0,
          waterSm: detail.WaterSm,
        })) || [],
      };
      
      setFormData(report);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report');
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
      differenceZdnRwbmt: '',
      differenceZdnRwbmtPercent: '',
      dipSm: '',
      govLiters: 0,
      rtcNo: '',
      rwbmtGross: '',
      rwbNo: '',
      sealNo: '',
      tovLiters: 0,
      temperatureC: '',
      type: '',
      waterLiters: 0,
      waterSm: '',
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.reportNo?.trim()) {
      errors.reportNo = 'Report number is required';
    }
    
    if (!formData.customer?.trim()) {
      errors.customer = 'Customer is required';
    }
    
    if (!formData.inspector?.trim()) {
      errors.inspector = 'Inspector is required';
    }
    
    if (!formData.product?.trim()) {
      errors.product = 'Product is required';
    }
    
    if (!formData.reportDate) {
      errors.reportDate = 'Report date is required';
    }
    
    if (!formData.reportDetails || formData.reportDetails.length === 0) {
      errors.reportDetails = 'At least one report detail is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateJsonPreview = () => {
    const canonicalJson = {
      Message: '',
      SendDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      Success: 'true',
      Hemjilt: {
        ContractNo: formData.contractNo || '',
        Customer: formData.customer || '',
        DischargeCommenced: formData.dischargeCommenced ? dayjs(formData.dischargeCommenced).format('YYYY-MM-DD HH:mm:ss') : '',
        DischargeCompleted: formData.dischargeCompleted ? dayjs(formData.dischargeCompleted).format('YYYY-MM-DD HH:mm:ss') : '',
        FullCompleted: formData.fullCompleted ? dayjs(formData.fullCompleted).format('YYYY-MM-DD HH:mm:ss') : '',
        HandledBy: formData.handledBy || '',
        HemjiltDetails: (formData.reportDetails || []).map(detail => ({
          ActualDensity: detail.actualDensity || '0',
          ZDNMT: detail.zdnmt || '0',
          DensityAt20c: detail.densityAt20c || '0',
          DifferenceZdnRWBMT: detail.differenceZdnRwbmt || '0',
          DifferenceZdnRWBMTProcent: detail.differenceZdnRwbmtPercent || '0',
          DipSm: detail.dipSm || '0',
          GOVLtr: detail.govLiters?.toString() || '0',
          RTCNo: detail.rtcNo || '',
          RWBMTGross: detail.rwbmtGross || '0',
          RWBNo: detail.rwbNo || '',
          SealNo: detail.sealNo || '',
          TOVltr: detail.tovLiters?.toString() || '0',
          Temperature: detail.temperatureC || '0',
          Type: detail.type || '',
          WaterLtr: detail.waterLiters?.toString() || '0',
          WaterSm: detail.waterSm || '0',
        })),
        Inspector: formData.inspector || '',
        Location: formData.location || '',
        Object: formData.object || '',
        Product: formData.product || '',
        ReportDate: formData.reportDate ? dayjs(formData.reportDate).format('YYYY-MM-DD HH:mm:ss') : '',
        ReportNo: formData.reportNo || '',
      },
    };
    setJsonPreview(JSON.stringify(canonicalJson, null, 2));
    setPreviewOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setValidationErrors({});

      if (isEdit && id) {
        await reportsApi.update(parseInt(id), formData);
      } else {
        await reportsApi.create(formData as any);
      }

      navigate('/reports');
    } catch (err: any) {
      setError(err.message || 'Failed to save report');
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
            {isEdit ? 'Edit Report' : 'New Report'}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
          >
            {isEdit ? 'Update existing measurement report' : 'Create a new measurement report'}
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
            💡 Keyboard shortcuts: Ctrl+S (Save), Ctrl+P (Preview JSON)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={generateJsonPreview}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a6fd8',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Preview JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/reports')}
            sx={{
              borderColor: '#dc3545',
              color: '#dc3545',
              '&:hover': {
                borderColor: '#c82333',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                background: 'rgba(102, 126, 234, 0.3)',
                boxShadow: 'none',
                transform: 'none',
              },
              transition: 'all 0.3s ease',
            }}
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Report Number *"
              value={formData.reportNo || ''}
              onChange={(e) => handleInputChange('reportNo', e.target.value)}
              required
              error={!!validationErrors.reportNo}
              helperText={validationErrors.reportNo}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer *"
              value={formData.customer || ''}
              onChange={(e) => handleInputChange('customer', e.target.value)}
              error={!!validationErrors.customer}
              helperText={validationErrors.customer}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contract Number"
              value={formData.contractNo || ''}
              onChange={(e) => handleInputChange('contractNo', e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product *"
              value={formData.product || ''}
              onChange={(e) => handleInputChange('product', e.target.value)}
              error={!!validationErrors.product}
              helperText={validationErrors.product}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Inspector *"
              value={formData.inspector || ''}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
              error={!!validationErrors.inspector}
              helperText={validationErrors.inspector}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Handled By"
              value={formData.handledBy || ''}
              onChange={(e) => handleInputChange('handledBy', e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Object"
              value={formData.object || ''}
              onChange={(e) => handleInputChange('object', e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DateTimePicker
              label="Report Date *"
              value={formData.reportDate ? dayjs(formData.reportDate) : null}
              onChange={(value) => handleDateChange('reportDate', value)}
              slotProps={{ 
                textField: { 
                  fullWidth: true,
                  error: !!validationErrors.reportDate,
                  helperText: validationErrors.reportDate,
                } 
              }}
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography 
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#667eea',
              }}
            >
              Report Details *
            </Typography>
            {validationErrors.reportDetails && (
              <Typography 
                variant="body2" 
                color="error" 
                sx={{ mt: 1 }}
              >
                {validationErrors.reportDetails}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addDetailRow}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Detail
          </Button>
        </Box>

        <TableContainer
          sx={{
            borderRadius: 2,
            border: '1px solid rgba(102, 126, 234, 0.1)',
            maxWidth: '100%',
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(102, 126, 234, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.5)',
              },
            },
          }}
        >
          <Table size="small" sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '150px' }}>RTC No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '150px' }}>RWB No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>RWBMT Gross</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '150px' }}>Seal No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '100px' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Dip (cm)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>TOV (L)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Water (cm)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Water (L)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>GOV (L)</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Temperature</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Density @ 20°C</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Actual Density</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>ZDNMT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Diff Zdn RWBMT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '120px' }}>Diff Zdn RWBMT %</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#667eea', minWidth: '100px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(formData.reportDetails || []).map((detail, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(102, 126, 234, 0.02)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  {/* RTC No */}
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.rtcNo || ''}
                      onChange={(e) => updateDetailField(index, 'rtcNo', e.target.value)}
                      fullWidth
                      sx={wideTextFieldStyles}
                    />
                  </TableCell>
                  {/* RWB No */}
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.rwbNo || ''}
                      onChange={(e) => updateDetailField(index, 'rwbNo', e.target.value)}
                      fullWidth
                      sx={wideTextFieldStyles}
                    />
                  </TableCell>
                  {/* RWBMT Gross */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.rwbmtGross || ''}
                      onChange={(e) => updateDetailField(index, 'rwbmtGross', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Seal No */}
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.sealNo || ''}
                      onChange={(e) => updateDetailField(index, 'sealNo', e.target.value)}
                      fullWidth
                      sx={wideTextFieldStyles}
                    />
                  </TableCell>
                  {/* Type */}
                  <TableCell>
                    <TextField
                      size="small"
                      value={detail.type || ''}
                      onChange={(e) => updateDetailField(index, 'type', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Dip (cm) */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.dipSm || ''}
                      onChange={(e) => updateDetailField(index, 'dipSm', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* TOV (L) */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.tovLiters || ''}
                      onChange={(e) => updateDetailField(index, 'tovLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Water (cm) */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.waterSm || ''}
                      onChange={(e) => updateDetailField(index, 'waterSm', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Water (L) */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.waterLiters || ''}
                      onChange={(e) => updateDetailField(index, 'waterLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* GOV (L) */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.govLiters || ''}
                      onChange={(e) => updateDetailField(index, 'govLiters', parseInt(e.target.value) || 0)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Temperature */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.temperatureC || ''}
                      onChange={(e) => updateDetailField(index, 'temperatureC', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Density @ 20°C */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.densityAt20c || ''}
                      onChange={(e) => updateDetailField(index, 'densityAt20c', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Actual Density */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.actualDensity || ''}
                      onChange={(e) => updateDetailField(index, 'actualDensity', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* ZDNMT */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.zdnmt || ''}
                      onChange={(e) => updateDetailField(index, 'zdnmt', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Diff Zdn RWBMT */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.differenceZdnRwbmt || ''}
                      onChange={(e) => updateDetailField(index, 'differenceZdnRwbmt', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  {/* Diff Zdn RWBMT % */}
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={detail.differenceZdnRwbmtPercent || ''}
                      onChange={(e) => updateDetailField(index, 'differenceZdnRwbmtPercent', e.target.value)}
                      fullWidth
                      sx={smallTextFieldStyles}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => removeDetailRow(index)}
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
