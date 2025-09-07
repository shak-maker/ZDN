# 👥 User Management Guide

This guide covers all methods to manage users in the ZDN Report Management System.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Method 1: Terminal Commands](#method-1-terminal-commands)
3. [Method 2: Prisma Studio (GUI)](#method-2-prisma-studio-gui)
4. [Method 3: Frontend Interface](#method-3-frontend-interface)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The ZDN system supports three different ways to manage users:

- **Terminal Commands**: Quick and powerful for bulk operations
- **Prisma Studio**: Visual database management interface
- **Frontend Interface**: User-friendly web interface

Each method has its advantages depending on your needs.

---

## 🖥️ Method 1: Terminal Commands

### Prerequisites
- Access to the backend directory
- Node.js installed
- Database connection established

### Available Commands

#### List All Users
```bash
cd /Users/shaq/Documents/ZDN/backend
node manage-users.js list
```

**Output Example:**
```
📋 Current Users:
================
ID: 1 | Username: admin | Name: System Administrator | Role: ADMIN | Active: true
ID: 2 | Username: user | Name: Regular User | Role: USER | Active: true
```

#### Add New User
```bash
node manage-users.js add <username> <fullName> <password> [role]
```

**Examples:**
```bash
# Add regular user
node manage-users.js add john "John Doe" mypassword123 USER

# Add admin user
node manage-users.js add manager "Manager Name" ManagerPass123 ADMIN

# Add user with default USER role
node manage-users.js add sarah "Sarah Johnson" SarahPass123
```

#### Change Password
```bash
node manage-users.js password <username> <newPassword>
```

**Example:**
```bash
node manage-users.js password admin MySecurePassword2025!
```

#### Deactivate User
```bash
node manage-users.js deactivate <username>
```

**Example:**
```bash
node manage-users.js deactivate olduser
```

### Command Help
```bash
node manage-users.js
```
Shows all available commands and examples.

---

## 🖼️ Method 2: Prisma Studio (GUI)

### Accessing Prisma Studio

1. **Start Prisma Studio:**
   ```bash
   cd /Users/shaq/Documents/ZDN/backend
   npx prisma studio --port 5557
   ```

2. **Open in Browser:**
   - Go to: http://localhost:5557
   - You'll see your database tables

### Managing Users

#### View All Users
1. Click on the **"User"** table
2. See all users in a table format
3. View: ID, username, fullName, email, role, isActive, createdAt, updatedAt

#### Edit Existing User
1. Click on any user row
2. Edit fields directly:
   - `username`: Unique identifier
   - `fullName`: Display name
   - `email`: Optional email address
   - `password`: **⚠️ Must be hashed** (use terminal commands for password changes)
   - `role`: ADMIN or USER
   - `isActive`: true/false
3. Click **"Save"** to update

#### Add New User
1. Click the **"+"** button at the top
2. Fill in required fields:
   - `username`: Required, must be unique
   - `fullName`: Required
   - `password`: **⚠️ Must be hashed** (use terminal commands)
   - `role`: ADMIN or USER (default: USER)
   - `isActive`: true/false (default: true)
   - `email`: Optional
3. Click **"Save"** to create

#### Delete User
1. Click on the user row
2. Click the **trash icon** (🗑️)
3. Confirm deletion

### ⚠️ Important Notes for Prisma Studio
- **Password Field**: Always use terminal commands to change passwords (they need to be hashed)
- **Email Field**: Can be left empty (optional)
- **Role Field**: Must be exactly "ADMIN" or "USER"
- **isActive Field**: Use true/false (not 1/0)

---

## 🌐 Method 3: Frontend Interface

### Accessing User Management

1. **Login as Admin:**
   - Go to your application login page
   - Use admin credentials

2. **Navigate to User Management:**
   - Look for **"Team Members"** in the sidebar
   - Click to access the user management page

### Managing Users

#### View All Users
- See a table with all team members
- View: Username, Full Name, Role, Status, Created Date
- Users are color-coded by role (Admin = red, User = blue)

#### Add New User
1. Click **"Add User"** button
2. Fill in the form:
   - **Username**: Unique identifier
   - **Full Name**: Display name
   - **Password**: Minimum 6 characters
3. Click **"Create User"**
4. User is automatically created with USER role

#### User Information Display
- **Role Chips**: Color-coded role indicators
- **Status Chips**: Active/Inactive status
- **Creation Date**: When the user was added

### Frontend Limitations
- Cannot change passwords through frontend
- Cannot edit existing users
- Cannot delete users
- Use terminal commands or Prisma Studio for advanced operations

---

## 🔐 Security Best Practices

### Password Management
- **Use Strong Passwords**: Minimum 8 characters with numbers and symbols
- **Change Default Passwords**: Never keep `admin123` or `user123`
- **Regular Updates**: Change passwords periodically
- **Unique Passwords**: Each user should have a unique password

### User Roles
- **ADMIN Role**: Full system access, can manage users
- **USER Role**: Can view and manage reports only
- **Principle of Least Privilege**: Give users only the access they need

### Access Control
- **Limit Admin Access**: Only trusted team members should have ADMIN role
- **Monitor User Activity**: Keep track of who has access
- **Deactivate Unused Accounts**: Disable accounts for former employees

### Example Secure Passwords
```
✅ Good: MyCompany2025!Secure
✅ Good: ZDN_Report_System_2025
✅ Good: Admin@ZDN#2025
❌ Bad: admin123
❌ Bad: password
❌ Bad: 123456
```

---

## 🛠️ Troubleshooting

### Common Issues

#### "User already exists" Error
```bash
# Check if username exists
node manage-users.js list

# Use a different username
node manage-users.js add john2 "John Doe" mypassword123
```

#### "Invalid credentials" on Login
```bash
# Reset password
node manage-users.js password username newpassword123
```

#### Prisma Studio Connection Issues
```bash
# Check if Prisma Studio is running
# Restart if needed
npx prisma studio --port 5557
```

#### Frontend User Management Not Loading
1. Check if you're logged in as admin
2. Verify backend is running
3. Check browser console for errors

### Database Connection Issues
```bash
# Test database connection
cd /Users/shaq/Documents/ZDN/backend
npx prisma db push
```

### Password Hashing Issues
- **Never** enter plain text passwords in Prisma Studio
- **Always** use terminal commands for password changes
- Passwords are automatically hashed using bcrypt

---

## 📞 Support

### Quick Reference Commands
```bash
# List users
node manage-users.js list

# Add user
node manage-users.js add username "Full Name" password123

# Change password
node manage-users.js password username newpassword123

# Deactivate user
node manage-users.js deactivate username

# Show help
node manage-users.js
```

### File Locations
- **User Management Script**: `/Users/shaq/Documents/ZDN/backend/manage-users.js`
- **Database Schema**: `/Users/shaq/Documents/ZDN/backend/prisma/schema.prisma`
- **Frontend User Management**: `/Users/shaq/Documents/ZDN/frontend/src/pages/UserManagement.tsx`

### Getting Help
1. Check this documentation first
2. Use the help command: `node manage-users.js`
3. Check Prisma Studio for visual database inspection
4. Review browser console for frontend issues

---

## 🎯 Quick Start Checklist

### For New Team Members
1. ✅ Add user via terminal: `node manage-users.js add username "Full Name" password123`
2. ✅ Test login with new credentials
3. ✅ Verify user appears in Prisma Studio
4. ✅ Check user can access reports (USER role) or full system (ADMIN role)

### For Password Changes
1. ✅ Use terminal command: `node manage-users.js password username newpassword123`
2. ✅ Test login with new password
3. ✅ Inform user of password change

### For User Deactivation
1. ✅ Use terminal command: `node manage-users.js deactivate username`
2. ✅ Verify user cannot login
3. ✅ User remains in database but is inactive

---

*Last updated: January 2025*
*ZDN Report Management System v1.0*
