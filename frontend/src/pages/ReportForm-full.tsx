import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportsApi } from '../services/api';
import { parseReportDate, readField } from '../utils/reportDisplay';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Preview as PreviewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

const ink = '#0f2740';
const muted = '#5c6d7e';
const line = '#d7e0e8';
const accent = '#1d4e73';
const accentHover = '#163e5c';
const requiredMark = '#9f1239';
const monoFamily =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

const panelSx = {
  borderRadius: 2,
  backgroundColor: '#ffffff',
  border: `1px solid ${line}`,
  boxShadow: '0 1px 2px rgba(15, 39, 64, 0.04)',
};

const outlinedButtonSx = {
  borderColor: line,
  color: accent,
  '&:hover': {
    borderColor: accent,
    backgroundColor: 'rgba(29, 78, 115, 0.06)',
  },
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    backgroundColor: '#fff',
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: accent },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: accent,
      borderWidth: 2,
    },
  },
};

const numberInputSx = {
  ...fieldSx,
  '& .MuiOutlinedInput-input': {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    fontFamily: monoFamily,
  },
};

interface ReportDetail {
  id?: number;
  actualDensity?: string;
  zdnmt?: string;
  densityAt20c?: string;
  differenceZdnRwbmt?: string;
  differenceZdnRwbmtPercent?: string;
  dipSm?: string;
  govLiters?: number | string;
  rtcNo?: string;
  rwbmtGross?: string;
  rwbNo?: string;
  sealNo?: string;
  tovLiters?: number | string;
  temperatureC?: string;
  type?: string;
  waterLiters?: number | string;
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

type DetailKey = keyof ReportDetail;
type FieldKind = 'text' | 'number';

interface DetailField {
  key: DetailKey;
  label: string;
  kind: FieldKind;
}

const PRIMARY_FIELDS: DetailField[] = [
  { key: 'rtcNo', label: 'RTC No', kind: 'text' },
  { key: 'rwbNo', label: 'RWB No', kind: 'text' },
  { key: 'type', label: 'Type', kind: 'text' },
  { key: 'dipSm', label: 'Dip (cm)', kind: 'number' },
  { key: 'tovLiters', label: 'TOV (L)', kind: 'number' },
  { key: 'waterSm', label: 'Water (cm)', kind: 'number' },
  { key: 'waterLiters', label: 'Water (L)', kind: 'number' },
  { key: 'govLiters', label: 'GOV (L)', kind: 'number' },
  { key: 'temperatureC', label: 'Temperature', kind: 'number' },
  { key: 'densityAt20c', label: 'Density @ 20°C', kind: 'number' },
  { key: 'actualDensity', label: 'Actual Density', kind: 'number' },
  { key: 'zdnmt', label: 'ZDNMT', kind: 'number' },
];

const EXTRA_FIELDS: DetailField[] = [
  { key: 'rwbmtGross', label: 'RWBMT Gross', kind: 'number' },
  { key: 'sealNo', label: 'Seal No', kind: 'text' },
  { key: 'differenceZdnRwbmt', label: 'Diff Zdn RWBMT', kind: 'number' },
  { key: 'differenceZdnRwbmtPercent', label: 'Diff Zdn RWBMT %', kind: 'number' },
];

function measurementText(value: string | number | null | undefined): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

function literForPayload(value: string | number | null | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formDate(value: unknown): string {
  if (value == null || String(value).trim() === '') return '';
  const parsed = parseReportDate(String(value));
  return parsed ? parsed.date.toISOString() : String(value);
}

function mapDetail(detail: Record<string, unknown>): ReportDetail {
  const text = (keys: string[]) => measurementText(readField(detail, keys));
  const measure = (keys: string[]) => readField(detail, keys) ?? '';
  return {
    actualDensity: text(['ActualDensity', 'actualDensity']),
    zdnmt: text(['ZDNMT', 'zdnmt']),
    densityAt20c: text(['DensityAt20c', 'densityAt20c']),
    differenceZdnRwbmt: text([
      'DifferenceZdnRWBMT',
      'diffTon',
      'DiffrenceAmberRWBMT',
    ]),
    differenceZdnRwbmtPercent: text([
      'DifferenceZdnRWBMTProcent',
      'diffTonProcent',
      'DiffrenceAmberRWBMTProcent',
    ]),
    dipSm: text(['DipSm', 'dipSm']),
    govLiters: measure(['GOVLtr', 'govLiters']),
    rtcNo: text(['RTCNo', 'tankNo', 'rtcNo']),
    rwbmtGross: text(['RWBMTGross', 'documentWeight', 'rwbmtGross']),
    rwbNo: text(['RWBNo', 'billNo', 'rwbNo']),
    sealNo: text(['SealNo', 'sealNo']),
    tovLiters: measure(['TOVltr', 'tovLiters']),
    temperatureC: text(['Temperature', 'Temprature', 'temperatureC']),
    type: text(['Type', 'type']),
    waterLiters: measure(['WaterLtr', 'waterLiters']),
    waterSm: text(['WaterSm', 'waterSm']),
  };
}

function hasExtraValues(detail: ReportDetail): boolean {
  return EXTRA_FIELDS.some((field) => measurementText(detail[field.key] as string | number).trim() !== '');
}

function missingRequired(form: Partial<Report>): string[] {
  const missing: string[] = [];
  if (!form.reportNo?.trim()) missing.push('Report Number');
  if (!form.customer?.trim()) missing.push('Customer');
  if (!form.product?.trim()) missing.push('Product');
  if (!form.inspector?.trim()) missing.push('Inspector');
  if (!form.reportDate) missing.push('Report Date');
  if (!form.reportDetails || form.reportDetails.length === 0) missing.push('Report Details');
  return missing;
}

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: 'block',
        mb: 0.75,
        color: muted,
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      {children}
      {required && (
        <Box component="span" sx={{ color: requiredMark, ml: 0.4 }} aria-hidden="true">
          *
        </Box>
      )}
    </Typography>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h3"
      sx={{
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: accent,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

const ReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const nextRowId = useRef(1);

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
  const [rowIds, setRowIds] = useState<string[]>([]);
  const [extraOpen, setExtraOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jsonPreview, setJsonPreview] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const pendingFocusId = useRef<string | null>(null);

  const newRowId = () => {
    const rowId = `row-${nextRowId.current}`;
    nextRowId.current += 1;
    return rowId;
  };

  useEffect(() => {
    if (isEdit && id) {
      fetchReport(parseInt(id, 10));
    }
  }, [id, isEdit]);

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

  useEffect(() => {
    if (!pendingFocusId.current) return;
    const fieldId = `detail-${pendingFocusId.current}-rtcNo`;
    pendingFocusId.current = null;
    document.getElementById(fieldId)?.focus();
  }, [rowIds]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const response = await reportsApi.getById(reportId);
      const canonicalData = response.data as {
        Inspector?: string;
        Location?: string;
        Object?: string;
        Product?: string;
        ReportDate?: string;
        ReportNo?: string;
        Hemjilt?: {
          ContractNo?: string;
          Customer?: string;
          DischargeCommenced?: string;
          DischargeCompleted?: string;
          FullCompleted?: string;
          HandledBy?: string;
          Inspector?: string;
          Location?: string;
          Object?: string;
          Product?: string;
          ReportDate?: string;
          ReportNo?: string;
          HemjiltDetails?: Array<Record<string, unknown>>;
        };
      };
      const hemjilt = canonicalData.Hemjilt ?? {};
      const details = (hemjilt.HemjiltDetails ?? []).map(mapDetail);
      const ids = details.map(() => newRowId());
      const open: Record<string, boolean> = {};
      details.forEach((detail, index) => {
        if (hasExtraValues(detail)) open[ids[index]] = true;
      });

      setRowIds(ids);
      setExtraOpen(open);
      setFormData({
        contractNo: hemjilt.ContractNo || '',
        customer: hemjilt.Customer || '',
        dischargeCommenced: formDate(hemjilt.DischargeCommenced),
        dischargeCompleted: formDate(hemjilt.DischargeCompleted),
        fullCompleted: formDate(hemjilt.FullCompleted),
        handledBy: hemjilt.HandledBy || '',
        inspector: hemjilt.Inspector || canonicalData.Inspector || '',
        location: hemjilt.Location || canonicalData.Location || '',
        object: hemjilt.Object || canonicalData.Object || '',
        product: hemjilt.Product || canonicalData.Product || '',
        reportDate: formDate(hemjilt.ReportDate || canonicalData.ReportDate),
        reportNo: hemjilt.ReportNo || canonicalData.ReportNo || '',
        reportDetails: details,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load report';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    setValidationErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleInputChange = (field: keyof Report, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleDateChange = (field: keyof Report, value: Dayjs | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? value.toISOString() : '',
    }));
    clearFieldError(field);
  };

  const addDetailRow = () => {
    const rowId = newRowId();
    const newDetail: ReportDetail = {
      actualDensity: '',
      zdnmt: '',
      densityAt20c: '',
      differenceZdnRwbmt: '',
      differenceZdnRwbmtPercent: '',
      dipSm: '',
      govLiters: '',
      rtcNo: '',
      rwbmtGross: '',
      rwbNo: '',
      sealNo: '',
      tovLiters: '',
      temperatureC: '',
      type: '',
      waterLiters: '',
      waterSm: '',
    };

    pendingFocusId.current = rowId;
    setRowIds((prev) => [...prev, rowId]);
    setFormData((prev) => ({
      ...prev,
      reportDetails: [...(prev.reportDetails || []), newDetail],
    }));
    clearFieldError('reportDetails');
  };

  const removeDetailRow = (index: number) => {
    const removedId = rowIds[index];
    setRowIds((prev) => prev.filter((_, i) => i !== index));
    setExtraOpen((prev) => {
      if (!removedId || !prev[removedId]) return prev;
      const next = { ...prev };
      delete next[removedId];
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      reportDetails: prev.reportDetails?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateDetailField = (index: number, field: DetailKey, value: string) => {
    setFormData((prev) => ({
      ...prev,
      reportDetails:
        prev.reportDetails?.map((detail, i) =>
          i === index ? { ...detail, [field]: value } : detail,
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
      Success: '1',
      Hemjilt: {
        ContractNo: formData.contractNo || '',
        Customer: formData.customer || '',
        DischargeCommenced: formData.dischargeCommenced
          ? dayjs(formData.dischargeCommenced).format('YYYY-MM-DD HH:mm:ss')
          : '',
        DischargeCompleted: formData.dischargeCompleted
          ? dayjs(formData.dischargeCompleted).format('YYYY-MM-DD HH:mm:ss')
          : '',
        FullCompleted: formData.fullCompleted
          ? dayjs(formData.fullCompleted).format('YYYY-MM-DD HH:mm:ss')
          : '',
        HandledBy: formData.handledBy || '',
        HemjiltDetails: (formData.reportDetails || []).map((detail) => ({
          ActualDensity: detail.actualDensity || '0',
          ZDNMT: detail.zdnmt || '0',
          DensityAt20c: detail.densityAt20c || '0',
          DifferenceZdnRWBMT: detail.differenceZdnRwbmt || '0',
          DifferenceZdnRWBMTProcent: detail.differenceZdnRwbmtPercent || '0',
          DipSm: detail.dipSm || '0',
          GOVLtr: measurementText(detail.govLiters) || '0',
          RTCNo: detail.rtcNo || '',
          RWBMTGross: detail.rwbmtGross || '0',
          RWBNo: detail.rwbNo || '',
          SealNo: detail.sealNo || '',
          TOVltr: measurementText(detail.tovLiters) || '0',
          Temperature: detail.temperatureC || '0',
          Type: detail.type || '',
          WaterLtr: measurementText(detail.waterLiters) || '0',
          WaterSm: detail.waterSm || '0',
        })),
        Inspector: formData.inspector || '',
        Location: formData.location || '',
        Object: formData.object || '',
        Product: formData.product || '',
        ReportDate: formData.reportDate
          ? dayjs(formData.reportDate).format('YYYY-MM-DD HH:mm:ss')
          : '',
        ReportNo: formData.reportNo || '',
      },
    };
    setJsonPreview(JSON.stringify(canonicalJson, null, 2));
    setPreviewOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const missing = missingRequired(formData);
      setError(`Missing required fields: ${missing.join(', ')}`);
      window.scrollTo({ top: 0 });
      return;
    }

    try {
      setLoading(true);
      setError('');
      setValidationErrors({});

      const payload: Partial<Report> = {
        ...formData,
        reportDetails: (formData.reportDetails || []).map((detail) => ({
          ...detail,
          govLiters: literForPayload(detail.govLiters),
          tovLiters: literForPayload(detail.tovLiters),
          waterLiters: literForPayload(detail.waterLiters),
        })),
      };

      if (isEdit && id) {
        const reportId = parseInt(id, 10);
        if (isNaN(reportId)) {
          throw new Error('Invalid report ID');
        }
        await reportsApi.update(reportId, payload as Report);
      } else {
        await reportsApi.create(payload as Report);
      }

      navigate('/reports');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save report';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const missing = missingRequired(formData);
  const details = formData.reportDetails || [];

  const renderDetailFields = (detail: ReportDetail, index: number, fields: DetailField[]) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 1fr))',
        },
        columnGap: 3,
        rowGap: 2.5,
      }}
    >
      {fields.map((field) => {
        const fieldId = `detail-${rowIds[index]}-${field.key}`;
        return (
          <Box key={field.key} sx={{ minWidth: 0 }}>
            <FieldLabel htmlFor={fieldId}>{field.label}</FieldLabel>
            <TextField
              id={fieldId}
              size="small"
              fullWidth
              hiddenLabel
              value={measurementText(detail[field.key] as string | number)}
              onChange={(event) => updateDetailField(index, field.key, event.target.value)}
              inputProps={{
                inputMode: field.kind === 'number' ? 'decimal' : 'text',
              }}
              sx={field.kind === 'number' ? numberInputSx : fieldSx}
            />
          </Box>
        );
      })}
    </Box>
  );

  if (loading && isEdit) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
        <CircularProgress sx={{ color: accent }} />
        <Typography sx={{ color: muted }}>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'flex-start' }}
        mb={4}
        gap={2}
        sx={{ flexDirection: { xs: 'column', md: 'row' } }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: ink,
              fontSize: { xs: '1.6rem', sm: '1.85rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {isEdit ? 'Edit Report' : 'New Report'}
          </Typography>
          <Typography sx={{ color: muted, mt: 0.75, fontSize: '0.95rem' }}>
            {isEdit ? 'Update an existing measurement report' : 'Create a new measurement report'}
          </Typography>
          <Typography sx={{ color: muted, mt: 1, fontSize: '0.8rem' }}>
            Keyboard shortcuts: Ctrl+S (Save), Ctrl+P (Preview JSON)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { md: 'flex-end' }, gap: 1.25 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={generateJsonPreview}
              sx={outlinedButtonSx}
            >
              Preview JSON
            </Button>
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/reports')}
              sx={{
                borderColor: '#cbd5e1',
                color: '#475569',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: 'rgba(71, 85, 105, 0.06)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              startIcon={loading ? undefined : <SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                backgroundColor: accent,
                boxShadow: 'none',
                '&:hover': { backgroundColor: accentHover, boxShadow: 'none' },
                '&.Mui-disabled': { backgroundColor: 'rgba(29, 78, 115, 0.35)', color: '#fff' },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Save'}
            </Button>
          </Box>
          <Typography sx={{ color: missing.length ? muted : '#3f6f56', fontSize: '0.8rem', textAlign: { md: 'right' } }}>
            {missing.length === 0
              ? 'All required fields are filled'
              : `Missing required (${missing.length}): ${missing.join(', ')}`}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ ...panelSx, p: { xs: 3, sm: 4 }, mb: 3 }}>
        <Typography component="h2" sx={{ fontWeight: 600, color: accent, fontSize: '1.15rem', mb: 3 }}>
          Report Information
        </Typography>

        <SectionHeading>Identifiers</SectionHeading>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            columnGap: 4,
            rowGap: 3,
          }}
        >
          <Box>
            <FieldLabel htmlFor="report-no" required>
              Report Number
            </FieldLabel>
            <TextField
              id="report-no"
              fullWidth
              hiddenLabel
              value={formData.reportNo || ''}
              inputProps={{ 'aria-required': true }}
              onChange={(event) => handleInputChange('reportNo', event.target.value)}
              error={!!validationErrors.reportNo}
              helperText={validationErrors.reportNo}
              sx={fieldSx}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="customer" required>
              Customer
            </FieldLabel>
            <TextField
              id="customer"
              fullWidth
              hiddenLabel
              value={formData.customer || ''}
              inputProps={{ 'aria-required': true }}
              onChange={(event) => handleInputChange('customer', event.target.value)}
              error={!!validationErrors.customer}
              helperText={validationErrors.customer}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <FieldLabel htmlFor="contract-no">Contract Number</FieldLabel>
            <TextField
              id="contract-no"
              fullWidth
              hiddenLabel
              value={formData.contractNo || ''}
              onChange={(event) => handleInputChange('contractNo', event.target.value)}
              sx={fieldSx}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: line }} />

        <SectionHeading>Assignment</SectionHeading>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            columnGap: 4,
            rowGap: 3,
          }}
        >
          <Box>
            <FieldLabel htmlFor="product" required>
              Product
            </FieldLabel>
            <TextField
              id="product"
              fullWidth
              hiddenLabel
              value={formData.product || ''}
              inputProps={{ 'aria-required': true }}
              onChange={(event) => handleInputChange('product', event.target.value)}
              error={!!validationErrors.product}
              helperText={validationErrors.product}
              sx={fieldSx}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="inspector" required>
              Inspector
            </FieldLabel>
            <TextField
              id="inspector"
              fullWidth
              hiddenLabel
              value={formData.inspector || ''}
              inputProps={{ 'aria-required': true }}
              onChange={(event) => handleInputChange('inspector', event.target.value)}
              error={!!validationErrors.inspector}
              helperText={validationErrors.inspector}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <FieldLabel htmlFor="handled-by">Handled By</FieldLabel>
            <TextField
              id="handled-by"
              fullWidth
              hiddenLabel
              value={formData.handledBy || ''}
              onChange={(event) => handleInputChange('handledBy', event.target.value)}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <TextField
              id="location"
              fullWidth
              hiddenLabel
              value={formData.location || ''}
              onChange={(event) => handleInputChange('location', event.target.value)}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
            <FieldLabel htmlFor="object">Object</FieldLabel>
            <TextField
              id="object"
              fullWidth
              hiddenLabel
              value={formData.object || ''}
              onChange={(event) => handleInputChange('object', event.target.value)}
              sx={fieldSx}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: line }} />

        <SectionHeading>Dates</SectionHeading>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            columnGap: 4,
            rowGap: 3,
          }}
        >
          <Box>
            <FieldLabel htmlFor="report-date" required>
              Report Date
            </FieldLabel>
            <DateTimePicker
              value={formData.reportDate ? dayjs(formData.reportDate) : null}
              onChange={(value) => handleDateChange('reportDate', value)}
              slotProps={{
                textField: {
                  id: 'report-date',
                  fullWidth: true,
                  hiddenLabel: true,
                  inputProps: { 'aria-required': true },
                  error: !!validationErrors.reportDate,
                  helperText: validationErrors.reportDate,
                  sx: fieldSx,
                },
              }}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="discharge-commenced">Discharge Commenced</FieldLabel>
            <DateTimePicker
              value={formData.dischargeCommenced ? dayjs(formData.dischargeCommenced) : null}
              onChange={(value) => handleDateChange('dischargeCommenced', value)}
              slotProps={{
                textField: { id: 'discharge-commenced', fullWidth: true, hiddenLabel: true, sx: fieldSx },
              }}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="discharge-completed">Discharge Completed</FieldLabel>
            <DateTimePicker
              value={formData.dischargeCompleted ? dayjs(formData.dischargeCompleted) : null}
              onChange={(value) => handleDateChange('dischargeCompleted', value)}
              slotProps={{
                textField: { id: 'discharge-completed', fullWidth: true, hiddenLabel: true, sx: fieldSx },
              }}
            />
          </Box>
          <Box>
            <FieldLabel htmlFor="full-completed">Full Completed</FieldLabel>
            <DateTimePicker
              value={formData.fullCompleted ? dayjs(formData.fullCompleted) : null}
              onChange={(value) => handleDateChange('fullCompleted', value)}
              slotProps={{
                textField: { id: 'full-completed', fullWidth: true, hiddenLabel: true, sx: fieldSx },
              }}
            />
          </Box>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ ...panelSx, p: { xs: 3, sm: 4 } }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={2}
          mb={3}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        >
          <Box>
            <Typography component="h2" sx={{ fontWeight: 600, color: accent, fontSize: '1.15rem' }}>
              Report Details
              <Box component="span" sx={{ color: requiredMark, ml: 0.4 }} aria-hidden="true">
                *
              </Box>
            </Typography>
            {validationErrors.reportDetails && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {validationErrors.reportDetails}
              </Typography>
            )}
          </Box>
          <Button
            type="button"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addDetailRow}
            sx={{
              alignSelf: { xs: 'flex-start', sm: 'center' },
              backgroundColor: accent,
              boxShadow: 'none',
              '&:hover': { backgroundColor: accentHover, boxShadow: 'none' },
            }}
          >
            Add Detail
          </Button>
        </Box>

        {details.length === 0 ? (
          <Box
            sx={{
              border: `1px dashed ${line}`,
              borderRadius: 2,
              py: 5,
              px: 3,
              textAlign: 'center',
              color: muted,
            }}
          >
            No detail rows yet. Use Add Detail to start.
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {details.map((detail, index) => {
              const rowId = rowIds[index] || `fallback-${index}`;
              const open = !!extraOpen[rowId];
              return (
                <Box
                  key={rowId}
                  sx={{
                    border: `1px solid ${line}`,
                    borderRadius: 2,
                    p: { xs: 2, sm: 2.5 },
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f7fafb',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography sx={{ fontWeight: 700, color: ink, fontSize: '0.95rem' }}>
                      Row {index + 1}
                    </Typography>
                    <Button
                      type="button"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeDetailRow(index)}
                      sx={{
                        color: '#9f1239',
                        '&:hover': { backgroundColor: 'rgba(159, 18, 57, 0.08)' },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>

                  {renderDetailFields(detail, index, PRIMARY_FIELDS)}

                  <Button
                    type="button"
                    size="small"
                    aria-expanded={open}
                    aria-controls={`extra-${rowId}`}
                    onClick={() =>
                      setExtraOpen((prev) => ({ ...prev, [rowId]: !prev[rowId] }))
                    }
                    startIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ color: accent, mt: 2, px: 0.5 }}
                  >
                    Additional fields
                  </Button>
                  <Collapse in={open} id={`extra-${rowId}`}>
                    <Box sx={{ pt: 2 }}>{renderDetailFields(detail, index, EXTRA_FIELDS)}</Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: ink }}>JSON Preview</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: muted }}>
            This is how the report will be stored in the canonical JSON format.
          </DialogContentText>
          <Divider sx={{ my: 2, borderColor: line }} />
          <Box
            component="pre"
            sx={{
              backgroundColor: '#f4f7f9',
              border: `1px solid ${line}`,
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: '400px',
              fontSize: '0.8125rem',
              fontFamily: monoFamily,
              color: ink,
            }}
          >
            {jsonPreview}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={() => setPreviewOpen(false)} sx={{ color: muted }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportForm;
