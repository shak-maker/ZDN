import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsApi } from '../services/api';
import {
  formatAverage,
  formatInteger,
  formatMeasurement,
  formatReportDate,
  formatText,
  isColumnEmpty,
  MISSING_DATE_LABEL,
  readField,
  toNumber,
} from '../utils/reportDisplay';
import {
  Box,
  Typography,
  Button,
  Paper,
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
  DialogContentText,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const ink = '#0f2740';
const muted = '#5c6d7e';
const line = '#d7e0e8';
const accent = '#1d4e73';
const accentHover = '#163e5c';
const headerBg = '#e7eef3';
const monoFamily =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

const panelSx = {
  borderRadius: 2,
  backgroundColor: '#ffffff',
  border: `1px solid ${line}`,
  boxShadow: '0 1px 2px rgba(15, 39, 64, 0.04)',
};

const sectionTitleSx = {
  fontWeight: 600,
  color: accent,
  fontSize: '1.15rem',
  letterSpacing: '-0.01em',
  mb: 3,
};

const groupLabelSx = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: muted,
  mb: 1.5,
};

const outlinedButtonSx = {
  borderColor: line,
  color: accent,
  '&:hover': {
    borderColor: accent,
    backgroundColor: 'rgba(29, 78, 115, 0.06)',
  },
};

interface ReportPayload {
  createdAt?: string;
  updatedAt?: string;
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
}

interface ReportDetail {
  actualDensity?: string | number;
  zdnmt?: string | number;
  densityAt20c?: string | number;
  differenceZdnRwbmt?: string | number;
  differenceZdnRwbmtPercent?: string | number;
  dipSm?: string | number;
  govLiters?: string | number;
  rtcNo?: string | number;
  rwbmtGross?: string | number;
  rwbNo?: string | number;
  sealNo?: string | number;
  tovLiters?: string | number;
  temperatureC?: string | number;
  type?: string | number;
  waterLiters?: string | number;
  waterSm?: string | number;
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

type ColumnKind = 'text' | 'number';

interface DetailColumn {
  key: keyof ReportDetail;
  label: string;
  kind: ColumnKind;
}

const DETAIL_COLUMNS: DetailColumn[] = [
  { key: 'rtcNo', label: 'RTC дугаар', kind: 'text' },
  { key: 'rwbNo', label: 'RWB дугаар', kind: 'text' },
  { key: 'rwbmtGross', label: 'RWBMT нийт', kind: 'number' },
  { key: 'sealNo', label: 'Лацны дугаар', kind: 'text' },
  { key: 'type', label: 'Төрөл', kind: 'text' },
  { key: 'dipSm', label: 'Гүн (см)', kind: 'number' },
  { key: 'tovLiters', label: 'TOV (л)', kind: 'number' },
  { key: 'waterSm', label: 'Ус (см)', kind: 'number' },
  { key: 'waterLiters', label: 'Ус (л)', kind: 'number' },
  { key: 'govLiters', label: 'GOV (л)', kind: 'number' },
  { key: 'temperatureC', label: 'Температур', kind: 'number' },
  { key: 'densityAt20c', label: 'Нягт (20°C)', kind: 'number' },
  { key: 'actualDensity', label: 'Бодит нягт', kind: 'number' },
  { key: 'zdnmt', label: 'ZDNMT', kind: 'number' },
  { key: 'differenceZdnRwbmt', label: 'Зөрүү ZDN–RWBMT', kind: 'number' },
  { key: 'differenceZdnRwbmtPercent', label: 'Зөрүү ZDN–RWBMT %', kind: 'number' },
];

function mapDetail(detail: Record<string, unknown>): ReportDetail {
  return {
    actualDensity: readField(detail, ['ActualDensity', 'actualDensity']),
    zdnmt: readField(detail, ['ZDNMT', 'zdnmt']),
    densityAt20c: readField(detail, ['DensityAt20c', 'densityAt20c']),
    differenceZdnRwbmt: readField(detail, [
      'DifferenceZdnRWBMT',
      'diffTon',
      'DiffrenceAmberRWBMT',
    ]),
    differenceZdnRwbmtPercent: readField(detail, [
      'DifferenceZdnRWBMTProcent',
      'diffTonProcent',
      'DiffrenceAmberRWBMTProcent',
    ]),
    dipSm: readField(detail, ['DipSm', 'dipSm']),
    govLiters: readField(detail, ['GOVLtr', 'govLiters']),
    rtcNo: readField(detail, ['RTCNo', 'tankNo', 'rtcNo']),
    rwbmtGross: readField(detail, ['RWBMTGross', 'documentWeight', 'rwbmtGross']),
    rwbNo: readField(detail, ['RWBNo', 'billNo', 'rwbNo']),
    sealNo: readField(detail, ['SealNo', 'sealNo']),
    tovLiters: readField(detail, ['TOVltr', 'tovLiters']),
    temperatureC: readField(detail, ['Temperature', 'Temprature', 'temperatureC']),
    type: readField(detail, ['Type', 'type']),
    waterLiters: readField(detail, ['WaterLtr', 'waterLiters']),
    waterSm: readField(detail, ['WaterSm', 'waterSm']),
  };
}

function mapReport(payload: ReportPayload, reportId: number): Report {
  const hemjilt = payload.Hemjilt ?? {};
  return {
    id: reportId,
    contractNo: hemjilt.ContractNo,
    customer: hemjilt.Customer,
    dischargeCommenced: hemjilt.DischargeCommenced,
    dischargeCompleted: hemjilt.DischargeCompleted,
    fullCompleted: hemjilt.FullCompleted,
    handledBy: hemjilt.HandledBy,
    inspector: hemjilt.Inspector || payload.Inspector,
    location: hemjilt.Location || payload.Location,
    object: hemjilt.Object || payload.Object,
    product: hemjilt.Product || payload.Product,
    reportDate: hemjilt.ReportDate || payload.ReportDate,
    reportNo: hemjilt.ReportNo || payload.ReportNo || '',
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
    reportDetails: (hemjilt.HemjiltDetails ?? []).map(mapDetail),
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const missing = children === MISSING_DATE_LABEL;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="div"
        sx={{ color: muted, fontSize: '0.75rem', fontWeight: 600, mb: 0.75 }}
      >
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{
          color: missing ? muted : ink,
          fontSize: '1rem',
          lineHeight: 1.5,
          fontWeight: missing ? 400 : 500,
          wordBreak: 'break-word',
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function SummaryRow({
  label,
  value,
  numeric = false,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  const missing = value === MISSING_DATE_LABEL;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 2,
      }}
    >
      <Typography sx={{ color: muted, fontSize: '0.875rem' }}>{label}</Typography>
      <Typography
        sx={{
          color: missing ? muted : ink,
          fontWeight: 600,
          fontSize: '0.95rem',
          textAlign: 'right',
          fontFamily: numeric ? monoFamily : undefined,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

const ReportViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [canonicalReport, setCanonicalReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport(parseInt(id, 10));
    }
  }, [id]);

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true);
      const response = await reportsApi.getById(reportId);
      const payload = response.data as unknown as ReportPayload;
      setCanonicalReport(payload);
      setReport(mapReport(payload, reportId));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Тайланг ачаалж чадсангүй';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    if (!canonicalReport) return;

    const dataStr = JSON.stringify(canonicalReport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const reportNo = canonicalReport.Hemjilt?.ReportNo || canonicalReport.ReportNo || 'unknown';
    const exportFileDefaultName = `report_${reportNo}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const details = useMemo(() => report?.reportDetails ?? [], [report]);

  const { visibleColumns, hiddenColumns } = useMemo(() => {
    const visible = DETAIL_COLUMNS.filter(
      (column) => !isColumnEmpty(details, (row) => row[column.key]),
    );
    const hidden = DETAIL_COLUMNS.filter((column) => !visible.includes(column));
    return { visibleColumns: visible, hiddenColumns: hidden };
  }, [details]);

  const totals = useMemo(() => {
    const totalGov = details.reduce((sum, detail) => sum + toNumber(detail.govLiters), 0);
    const totalTov = details.reduce((sum, detail) => sum + toNumber(detail.tovLiters), 0);
    const totalWater = details.reduce((sum, detail) => sum + toNumber(detail.waterLiters), 0);
    const avgTemp =
      details.length > 0
        ? details.reduce((sum, detail) => sum + toNumber(detail.temperatureC), 0) / details.length
        : 0;
    return { totalGov, totalTov, totalWater, avgTemp };
  }, [details]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px" gap={2}>
        <CircularProgress sx={{ color: accent }} />
        <Typography sx={{ color: muted }}>Ачаалж байна…</Typography>
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Тайлан олдсонгүй'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/reports')}
          sx={outlinedButtonSx}
        >
          Тайлангууд руу буцах
        </Button>
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
            Тайлан {report.reportNo}
          </Typography>
          <Typography sx={{ color: muted, mt: 0.75, fontSize: '0.95rem' }}>
            Хэмжилтийн тайлангийн дэлгэрэнгүй
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CodeIcon />}
            onClick={() => setJsonDialogOpen(true)}
            sx={outlinedButtonSx}
          >
            JSON харах
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadJson}
            sx={outlinedButtonSx}
          >
            JSON татах
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/reports/${report.id}/edit`)}
            sx={{
              backgroundColor: accent,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: accentHover,
                boxShadow: 'none',
              },
            }}
          >
            Засах
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
            sx={outlinedButtonSx}
          >
            Буцах
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.7fr) minmax(280px, 0.9fr)' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper elevation={0} sx={{ ...panelSx, p: { xs: 3, sm: 4 } }}>
          <Typography component="h2" sx={sectionTitleSx}>
            Тайлангийн мэдээлэл
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              columnGap: { xs: 2, sm: 4 },
              rowGap: 3,
            }}
          >
            <Field label="Тайлангийн дугаар">{report.reportNo}</Field>
            <Field label="Захиалагч">{formatText(report.customer)}</Field>
            <Field label="Гэрээний дугаар">{formatText(report.contractNo)}</Field>
            <Field label="Бүтээгдэхүүн">
              {report.product ? (
                <Chip
                  label={report.product}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: accent,
                    color: accent,
                    fontWeight: 600,
                    height: 28,
                  }}
                />
              ) : (
                formatText(report.product)
              )}
            </Field>
            <Field label="Байцаагч">{formatText(report.inspector)}</Field>
            <Field label="Гүйцэтгэсэн">{formatText(report.handledBy)}</Field>
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <Field label="Байршил">{formatText(report.location)}</Field>
            </Box>
            <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
              <Field label="Объект">{formatText(report.object)}</Field>
            </Box>
            <Field label="Тайлангийн огноо">{formatReportDate(report.reportDate)}</Field>
            <Field label="Буулгалт эхэлсэн">{formatReportDate(report.dischargeCommenced)}</Field>
            <Field label="Буулгалт дууссан">{formatReportDate(report.dischargeCompleted)}</Field>
            <Field label="Бүрэн дууссан">{formatReportDate(report.fullCompleted)}</Field>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ ...panelSx, p: { xs: 3, sm: 4 } }}>
          <Typography component="h2" sx={sectionTitleSx}>
            Хураангуй
          </Typography>

          <Typography component="h3" sx={groupLabelSx}>
            Бүртгэл
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SummaryRow label="Үүсгэсэн" value={formatReportDate(report.createdAt)} />
            <SummaryRow label="Сүүлд шинэчилсэн" value={formatReportDate(report.updatedAt)} />
            <SummaryRow label="Нийт мөр" value={formatInteger(details.length)} numeric />
          </Box>

          <Divider sx={{ my: 3, borderColor: line }} />

          <Typography component="h3" sx={groupLabelSx}>
            Хэмжилтийн дүн
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <SummaryRow label="Нийт GOV (л)" value={formatMeasurement(totals.totalGov)} numeric />
            <SummaryRow label="Нийт TOV (л)" value={formatMeasurement(totals.totalTov)} numeric />
            <SummaryRow label="Нийт ус (л)" value={formatMeasurement(totals.totalWater)} numeric />
            <SummaryRow
              label="Дундаж температур (°C)"
              value={formatAverage(totals.avgTemp)}
              numeric
            />
          </Box>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ ...panelSx, p: { xs: 3, sm: 4 }, mt: 3 }}>
        <Typography component="h2" sx={sectionTitleSx}>
          Хэмжилтийн мөр ({formatInteger(details.length)})
        </Typography>
        {details.length > 0 && visibleColumns.length > 0 ? (
          <>
            <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table size="small" sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableCell
                        key={column.key}
                        align={column.kind === 'number' ? 'right' : 'left'}
                        sx={{
                          fontWeight: 600,
                          color: accent,
                          backgroundColor: headerBg,
                          borderBottom: `1px solid ${line}`,
                          fontSize: '0.75rem',
                          lineHeight: 1.35,
                          verticalAlign: 'bottom',
                          py: 1.5,
                          px: 1.5,
                          whiteSpace: 'normal',
                          minWidth: column.kind === 'number' ? 88 : 96,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((detail, index) => (
                    <TableRow
                      key={`${detail.rtcNo ?? 'row'}-${index}`}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: '#f7fafb' },
                        '&:hover': { backgroundColor: '#eef4f7' },
                      }}
                    >
                      {visibleColumns.map((column) => {
                        const raw = detail[column.key];
                        const numeric = column.kind === 'number';
                        return (
                          <TableCell
                            key={column.key}
                            align={numeric ? 'right' : 'left'}
                            sx={{
                              color: ink,
                              borderColor: '#e6edf2',
                              py: 1.25,
                              px: 1.5,
                              fontSize: '0.8125rem',
                              whiteSpace: 'nowrap',
                              fontFamily: numeric ? monoFamily : undefined,
                              fontVariantNumeric: numeric ? 'tabular-nums' : undefined,
                            }}
                          >
                            {numeric ? formatMeasurement(raw) : formatText(raw)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {hiddenColumns.length > 0 && (
              <Typography sx={{ mt: 2, color: muted, fontSize: '0.8125rem' }}>
                Хоосон багана нуугдсан: {hiddenColumns.map((column) => column.label).join(', ')}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ color: muted }}>
            Энэ тайланд хэмжилтийн мөр байхгүй.
          </Typography>
        )}
      </Paper>

      <Dialog open={jsonDialogOpen} onClose={() => setJsonDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: ink }}>Тайлангийн JSON</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: muted }}>
            Энэ тайлангийн каноник JSON бүтэц.
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
            {canonicalReport ? JSON.stringify(canonicalReport, null, 2) : 'Ачаалж байна…'}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setJsonDialogOpen(false)} sx={{ color: muted }}>
            Хаах
          </Button>
          <Button onClick={downloadJson} startIcon={<DownloadIcon />} sx={{ color: accent }}>
            Татах
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportViewer;
