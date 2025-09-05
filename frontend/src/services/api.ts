import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ReportDetail {
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

export interface Report {
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

export interface ReportsResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  customer?: string;
  inspector?: string;
  product?: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/api/auth/register', { username, email, password }),
  getProfile: () => api.get('/api/auth/profile'),
};

export const reportsApi = {
  getAll: (params?: QueryParams) => api.get<ReportsResponse>('/api/reports', { params }),
  getById: (id: number) => api.get<Report>(`/api/reports/${id}`),
  create: (report: Report) => api.post<Report>('/api/reports', report),
  update: (id: number, report: Partial<Report>) => api.patch<Report>(`/api/reports/${id}`, report),
  delete: (id: number) => api.delete(`/api/reports/${id}`),
  getByReportNo: (reportNo: string) => api.get(`/api/reports/external/${reportNo}`),
};

export default api;
