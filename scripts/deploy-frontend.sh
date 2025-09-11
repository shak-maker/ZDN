#!/bin/bash

# Frontend Deployment Script for Digital Ocean
echo "🚀 Starting frontend deployment..."

# Set environment variables
export VITE_API_URL=http://157.230.39.49:3001
export NODE_ENV=production

# Navigate to frontend directory
cd frontend

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Copy built files to nginx directory
    echo "📁 Copying files to nginx directory..."
    sudo cp -r dist/* /var/www/html/
    
    # Set proper permissions
    sudo chown -R www-data:www-data /var/www/html/
    sudo chmod -R 755 /var/www/html/
    
    # Reload nginx
    echo "🔄 Reloading nginx..."
    sudo nginx -t && sudo systemctl reload nginx
    
    echo "🎉 Deployment completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
