#!/bin/bash

echo "🔧 Fixing logo serving issue..."

# Check if logo file exists in public directory
if [ -f "frontend/public/zdn-logo.png" ]; then
    echo "✅ Logo file found in public directory"
    
    # Copy to nginx directory
    sudo cp frontend/public/zdn-logo.png /var/www/html/
    sudo chown www-data:www-data /var/www/html/zdn-logo.png
    sudo chmod 644 /var/www/html/zdn-logo.png
    
    echo "📁 Logo copied to nginx directory"
else
    echo "❌ Logo file not found in frontend/public/"
    echo "Please make sure zdn-logo.png exists in the public directory"
fi

# Check if logo is accessible
echo "🔍 Testing logo accessibility..."
if curl -I http://localhost/zdn-logo.png | grep -q "200 OK"; then
    echo "✅ Logo is accessible via nginx"
else
    echo "❌ Logo is not accessible via nginx"
fi

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx
echo "🔄 Nginx reloaded"
