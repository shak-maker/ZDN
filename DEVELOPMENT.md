# Development Guide

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Git
- Code editor (VS Code recommended)

### Quick Start
```bash
# Clone repository
git clone https://github.com/shak-maker/ZDN.git
cd ZDN

# Run setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup
```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Setup database
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development servers
cd backend && npm run start:dev &
cd frontend && npm run dev
```

## 🏗️ Project Structure

```
ZDN/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── controllers/     # API Controllers
│   │   │   ├── auth.controller.ts
│   │   │   └── reports.controller.ts
│   │   ├── services/        # Business Logic
│   │   │   ├── auth.service.ts
│   │   │   ├── reports.service.ts
│   │   │   └── json-transformation.service.ts
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── guards/         # Authentication Guards
│   │   ├── strategies/     # Passport Strategies
│   │   └── interfaces/     # TypeScript Interfaces
│   ├── prisma/             # Database Schema
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Page Components
│   │   │   ├── Login-beautiful.tsx
│   │   │   ├── ReportsList-full.tsx
│   │   │   ├── ReportForm-full.tsx
│   │   │   └── ReportViewer-full.tsx
│   │   ├── contexts/       # React Contexts
│   │   │   └── AuthContext-basic.tsx
│   │   ├── services/       # API Services
│   │   │   └── api.ts
│   │   └── App.tsx
│   └── package.json
├── .gitignore
├── README.md
├── DEPLOYMENT.md
└── setup.sh
```

## 🎨 Design System

### Color Palette
```css
/* Primary Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colors */
--primary: #667eea;
--secondary: #764ba2;
--success: #28a745;
--error: #dc3545;
--warning: #ffc107;
--info: #17a2b8;
```

### Typography
- **Headers**: Bold, gradient text
- **Body**: Clean, readable fonts
- **Responsive**: Scales across devices

### Components
- **Cards**: Glass morphism with backdrop blur
- **Buttons**: Gradient with hover effects
- **Forms**: Clean inputs with validation
- **Tables**: Alternating rows with hover effects

## 🔧 Development Commands

### Backend
```bash
cd backend

# Development
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run db:seed           # Alias for seed

# Testing
npm run test              # Run tests
npm run test:e2e          # Run e2e tests
```

### Frontend
```bash
cd frontend

# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build

# Linting
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Create new report
- [ ] Edit existing report
- [ ] Delete report
- [ ] Search reports
- [ ] Pagination
- [ ] Form validation
- [ ] Responsive design
- [ ] Keyboard shortcuts
- [ ] JSON export
- [ ] External API

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test external API
curl -H "X-API-Key: sample-api-key-12345" \
  http://localhost:3001/api/reports/external/00000/00006662/25
```

## 🐛 Debugging

### Common Issues

#### Backend Issues
1. **Database Connection**: Check `.env` DATABASE_URL
2. **JWT Errors**: Verify JWT_SECRET is set
3. **CORS Issues**: Check FRONTEND_URL in .env
4. **Port Conflicts**: Change PORT in .env

#### Frontend Issues
1. **API Connection**: Check VITE_API_URL
2. **Build Errors**: Clear node_modules and reinstall
3. **Styling Issues**: Check Material-UI imports
4. **Routing Issues**: Verify React Router setup

### Debug Tools
- **Backend**: NestJS built-in debugging
- **Frontend**: React DevTools
- **Database**: Prisma Studio
- **Network**: Browser DevTools

## 📝 Code Style

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use proper typing for API responses
- Avoid `any` type

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use Material-UI components consistently
- Follow React best practices

### NestJS
- Use decorators properly
- Implement proper error handling
- Use DTOs for validation
- Follow NestJS conventions

## 🔄 Git Workflow

### Branch Naming
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/component-name` - Code refactoring

### Commit Messages
```
feat: add new report validation
fix: resolve login redirect issue
docs: update API documentation
style: improve button hover effects
refactor: simplify report service
test: add unit tests for auth service
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Code review
6. Merge to main

## 🚀 Performance

### Frontend Optimization
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size
- Use proper image optimization

### Backend Optimization
- Implement caching strategies
- Optimize database queries
- Use proper pagination
- Implement rate limiting

## 📊 Monitoring

### Development Metrics
- Build times
- Bundle sizes
- Test coverage
- Performance metrics

### Production Metrics
- API response times
- Error rates
- User engagement
- System health

## 🔒 Security

### Development Security
- Never commit secrets
- Use environment variables
- Validate all inputs
- Implement proper authentication

### Security Checklist
- [ ] JWT secrets are strong
- [ ] API keys are secure
- [ ] Input validation implemented
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers set
