// Simple mock server for frontend testing
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock data
const mockReports = [
  {
    id: 1,
    reportNo: '00000/00006662/25',
    customer: 'M-Oil Group',
    inspector: 'Z.Unen',
    product: 'Gas Oil',
    reportDate: '2025-08-29',
    reportDetails: [
      {
        id: 1,
        rtcNo: '51389831',
        rwbNo: '24243332',
        sealNo: '4238841',
        type: '106',
        actualDensity: '0.8515',
        zdnmt: '61.266',
        temperatureC: '21.0',
        govLiters: 72936,
        tovLiters: 72936,
        waterLiters: 0
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if ((username === 'admin' && password === 'admin123') || 
      (username === 'user' && password === 'user123')) {
    res.json({
      access_token: 'mock-jwt-token',
      user: {
        id: 1,
        username: username,
        email: `${username}@example.com`,
        role: username === 'admin' ? 'ADMIN' : 'USER'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN'
  });
});

// Mock reports API
app.get('/api/reports', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredReports = mockReports;
  if (search) {
    filteredReports = mockReports.filter(report => 
      report.reportNo.includes(search) ||
      report.customer?.includes(search) ||
      report.inspector?.includes(search)
    );
  }
  
  res.json({
    data: filteredReports,
    total: filteredReports.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(filteredReports.length / limit)
  });
});

app.get('/api/reports/:id', (req, res) => {
  const report = mockReports.find(r => r.id === parseInt(req.params.id));
  if (report) {
    res.json(report);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

app.post('/api/reports', (req, res) => {
  const newReport = {
    id: mockReports.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockReports.push(newReport);
  res.status(201).json(newReport);
});

app.patch('/api/reports/:id', (req, res) => {
  const index = mockReports.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    mockReports[index] = { ...mockReports[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(mockReports[index]);
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

app.delete('/api/reports/:id', (req, res) => {
  const index = mockReports.findIndex(r => r.id === parseInt(req.params.id));
  if (index !== -1) {
    mockReports.splice(index, 1);
    res.json({ message: 'Report deleted successfully' });
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// External API
app.get('/api/reports/external/:reportNo', (req, res) => {
  const report = mockReports.find(r => r.reportNo === req.params.reportNo);
  if (report) {
    res.json({
      Message: '',
      SendDate: new Date().toISOString(),
      Success: 'true',
      Hemjilt: {
        ContractNo: report.contractNo || '',
        Customer: report.customer || '',
        DischargeCommenced: report.dischargeCommenced || '',
        DischargeCompleted: report.dischargeCompleted || '',
        FullCompleted: report.fullCompleted || '',
        HandledBy: report.handledBy || '',
        Inspector: report.inspector || '',
        Location: report.location || '',
        Object: report.object || '',
        Product: report.product || '',
        ReportDate: report.reportDate || '',
        ReportNo: report.reportNo,
        HemjiltDetails: report.reportDetails.map(detail => ({
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
          WaterSm: detail.waterCm || '0'
        }))
      }
    });
  } else {
    res.json({
      Message: 'Report not found',
      SendDate: new Date().toISOString(),
      Success: 'false',
      Hemjilt: {
        ContractNo: '',
        Customer: '',
        DischargeCommenced: '',
        DischargeCompleted: '',
        FullCompleted: '',
        HandledBy: '',
        Inspector: '',
        Location: '',
        Object: '',
        Product: '',
        ReportDate: '',
        ReportNo: '',
        HemjiltDetails: []
      }
    });
  }
});

// Swagger docs
app.get('/api/docs', (req, res) => {
  res.send(`
    <html>
      <head><title>API Documentation</title></head>
      <body>
        <h1>Mock API Server</h1>
        <p>This is a simple mock server for frontend testing.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li>POST /api/auth/login</li>
          <li>GET /api/auth/profile</li>
          <li>GET /api/reports</li>
          <li>GET /api/reports/:id</li>
          <li>POST /api/reports</li>
          <li>PATCH /api/reports/:id</li>
          <li>DELETE /api/reports/:id</li>
          <li>GET /api/reports/external/:reportNo</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔑 Test credentials: admin/admin123 or user/user123`);
});
