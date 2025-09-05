# ZDN Measurement Reports Management System

A professional full-stack web application for managing measurement reports with a modern, responsive interface.

## 🚀 Features

- **Beautiful Login System** - Modern, responsive login with gradient design
- **Report Management** - Full CRUD operations for measurement reports
- **Dynamic Form Builder** - Add multiple report details with validation
- **JSON Export** - Download reports in canonical JSON format
- **External API** - RESTful API for external system integration
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power user features for efficiency
- **Real-time Validation** - Form validation with helpful error messages

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Material-UI + Vite
- **Backend:** NestJS + TypeScript + Prisma ORM
- **Database:** SQLite (development) / MySQL (production)
- **Authentication:** JWT + API Key authentication
- **Styling:** Material-UI with custom gradient theme

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ZDN
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend Environment
Create `backend/.env` file:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# API Keys
API_KEY_SECRET="your-api-key-secret-here"

# Server
PORT=3001
NODE_ENV=development
```

#### Frontend Environment
Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Database Setup
```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start the Application

#### Option 1: Quick Start (Recommended)
```bash
# From project root
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🌐 Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api/docs

## 🔑 Demo Credentials

- **Username:** `admin`
- **Password:** `admin123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Reports Endpoints
- `GET /api/reports` - List all reports (JWT required)
- `POST /api/reports` - Create new report (JWT required)
- `GET /api/reports/:id` - Get report by ID (JWT required)
- `PATCH /api/reports/:id` - Update report (JWT required)
- `DELETE /api/reports/:id` - Delete report (JWT required)

### External API
- `GET /api/reports/external/:reportNo` - Get report by report number (API Key required)

**API Key:** `sample-api-key-12345`

## 🎨 Design System

### Color Palette
- **Primary:** Purple-blue gradient (#667eea to #764ba2)
- **Secondary:** Professional grays and whites
- **Accent:** Success green, error red

### Typography
- **Headers:** Bold, gradient text
- **Body:** Clean, readable fonts
- **Responsive:** Scales appropriately across devices

## ⌨️ Keyboard Shortcuts

### Reports List
- `Ctrl+N` - Create new report
- `Ctrl+F` - Focus search field

### Report Form
- `Ctrl+S` - Save report
- `Ctrl+P` - Preview JSON

## 🗄️ Database Schema

### Reports Table
- Basic report information (customer, inspector, dates, etc.)
- JSON data field for canonical format
- Timestamps for audit trail

### Report Details Table
- Individual measurement readings
- Linked to parent report
- All measurement fields (density, temperature, volumes, etc.)

## 🚀 Deployment

### Production Setup
1. Update `DATABASE_URL` to MySQL/PostgreSQL
2. Set secure `JWT_SECRET` and `API_KEY_SECRET`
3. Build frontend: `npm run build`
4. Deploy backend to your server
5. Configure reverse proxy (nginx/Apache)

### cPanel Deployment
See `DEPLOYMENT.md` for detailed cPanel deployment instructions.

## 🧪 Testing

### Manual Testing
1. **Login Flow** - Test authentication with demo credentials
2. **Report CRUD** - Create, read, update, delete reports
3. **Form Validation** - Test required field validation
4. **Responsive Design** - Test on different screen sizes
5. **API Integration** - Test external API endpoints

### API Testing
```bash
# Test external API
curl -H "X-API-Key: sample-api-key-12345" \
  http://localhost:3001/api/reports/external/00000/00006662/25
```

## 📁 Project Structure

```
ZDN/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── dto/            # Data transfer objects
│   │   ├── guards/         # Authentication guards
│   │   └── interfaces/     # TypeScript interfaces
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── services/       # API services
│   └── package.json
├── .gitignore
├── README.md
└── setup.sh               # Quick setup script
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api/docs`

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD functionality
- Modern UI with responsive design
- External API for system integration
- Comprehensive form validation
- Keyboard shortcuts for power users

---

**Built with ❤️ by the ZDN Development Team**