# Measurement Reports Management System

## Project Overview

A professional web application for managing measurement reports with canonical JSON format storage and external API access. The system allows users to input report data through a web form, automatically transforms it into a canonical JSON schema, stores it in a MySQL database, and provides external API access for clients.

## 🏗️ Architecture

### Frontend (React + Material UI)
- **Framework**: React 18 with TypeScript
- **UI Library**: Material UI (MUI)
- **Routing**: React Router
- **State Management**: React Context API
- **Build Tool**: Vite
- **Features**:
  - Responsive design with Material UI components
  - Dynamic form with add/remove rows for report details
  - JSON preview modal before saving
  - Report list with pagination and search
  - Report viewer with summary and JSON download
  - JWT authentication

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT for internal users, API key for external clients
- **Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator with DTOs
- **Features**:
  - RESTful API with proper error handling
  - Data transformation service for canonical JSON
  - Audit logging
  - Role-based access control

### Database Schema
- **Reports Table**: Main report information
- **Report Details Table**: Individual measurement details
- **Users Table**: Internal user management
- **API Keys Table**: External client authentication
- **Audit Logs Table**: Activity tracking

## 🚀 Key Features

### 1. Report Management
- Create, read, update, delete reports
- Dynamic form with unlimited detail rows
- Real-time JSON preview
- Bulk operations support

### 2. Canonical JSON Format
- Automatic transformation from form data to canonical JSON
- Consistent schema across all reports
- External API compatibility

### 3. Authentication & Security
- JWT authentication for internal users
- API key authentication for external clients
- Role-based access control (Admin/User)
- Secure password hashing

### 4. External API
- Public API endpoint for report retrieval
- API key-based authentication
- Canonical JSON response format
- Error handling with proper HTTP status codes

### 5. User Interface
- Modern, responsive Material UI design
- Intuitive navigation and workflows
- Real-time validation and feedback
- Export capabilities (JSON download)

## 📁 Project Structure

```
ZDN/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── dto/            # Data transfer objects
│   │   ├── guards/         # Authentication guards
│   │   ├── strategies/     # JWT strategy
│   │   └── interfaces/     # TypeScript interfaces
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── .env.example        # Environment variables template
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── public/
│       └── .htaccess       # Apache configuration
├── package.json            # Root package.json
├── setup.sh               # Setup script
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # Project documentation
```

## 🔧 API Endpoints

### Internal API (JWT Authentication)
- `POST /api/reports` - Create report
- `GET /api/reports` - List reports (paginated)
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### External API (API Key Authentication)
- `GET /api/reports/external/:reportNo` - Get report by report number

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

## 🗄️ Database Schema

### Reports Table
- Primary report information
- JSON data column for canonical format
- Timestamps and metadata

### Report Details Table
- Individual measurement details
- Foreign key relationship to reports
- Numeric fields for calculations

### Users Table
- User authentication and authorization
- Role-based access control

### API Keys Table
- External client authentication
- Key management and validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL database
- npm or yarn

### Quick Setup
1. Clone the repository
2. Run the setup script: `./setup.sh`
3. Update database credentials in `backend/.env`
4. Run migrations: `cd backend && npx prisma migrate dev`
5. Seed database: `cd backend && npm run db:seed`
6. Start development: `npm run dev`

### Default Credentials
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `user`, password: `user123`
- **API Key**: `sample-api-key-12345`

## 🌐 Deployment

The application is designed for cPanel deployment with:
- Node.js application manager
- MySQL database
- Apache web server
- SSL/HTTPS support

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🔒 Security Features

- JWT token authentication
- API key validation
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📊 Monitoring & Logging

- Audit logs for all report operations
- Error tracking and logging
- API request/response logging
- User activity tracking

## 🧪 Testing

- Unit tests for services
- Integration tests for API endpoints
- E2E tests for critical user flows
- Database seeding for test data

## 🔄 Future Enhancements

- Excel/PDF export functionality
- Advanced reporting and analytics
- Email notifications
- Bulk import/export
- Advanced search and filtering
- Real-time updates with WebSockets
- Mobile app support
- Multi-language support

## 📞 Support

For technical support or questions:
1. Check the documentation in `README.md` and `DEPLOYMENT.md`
2. Review the API documentation at `/api/docs`
3. Check application logs for error details
4. Verify database connectivity and credentials

## 📄 License

This project is proprietary software developed for measurement report management.
