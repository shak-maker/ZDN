#!/bin/bash

echo "🚀 Setting up Measurement Reports Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
npm install

# Copy environment file
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Created .env file. Please update it with your database credentials."
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Check if database is configured
if grep -q "mysql://username:password@localhost:3306/measurement_reports" .env; then
    echo "⚠️  Please update the DATABASE_URL in backend/.env with your MySQL credentials"
    echo "   Example: DATABASE_URL=\"mysql://your_user:your_password@localhost:3306/your_database\""
    echo ""
    echo "   After updating the database URL, run:"
    echo "   cd backend && npx prisma migrate dev && npm run db:seed"
else
    echo "🗄️ Running database migrations..."
    npx prisma migrate dev --name init
    
    echo "🌱 Seeding database..."
    npm run db:seed
fi

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install frontend dependencies
npm install

# Create environment file
if [ ! -f .env ]; then
    echo "REACT_APP_API_URL=http://localhost:3001" > .env
    echo "📝 Created frontend .env file"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your database credentials"
echo "2. Run database migrations: cd backend && npx prisma migrate dev"
echo "3. Seed the database: cd backend && npm run db:seed"
echo "4. Start the development servers: npm run dev"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/api/docs"
echo ""
echo "👤 Default login credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🔑 Sample API Key for external access: sample-api-key-12345"
