const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Function to hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Function to list all users
async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    
    console.log('📋 Current Users:');
    console.log('================');
    users.forEach(user => {
      console.log(`ID: ${user.id} | Username: ${user.username} | Name: ${user.fullName} | Role: ${user.role} | Active: ${user.isActive}`);
    });
  } catch (error) {
    console.error('Error listing users:', error.message);
  }
}

// Function to add a new user
async function addUser(username, fullName, password, role = 'USER', email = null) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });
    
    if (existingUser) {
      console.log('❌ User with this username already exists!');
      return;
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password: hashedPassword,
        role,
        isActive: true
      }
    });
    
    console.log('✅ User created successfully!');
    console.log(`Username: ${newUser.username}`);
    console.log(`Full Name: ${newUser.fullName}`);
    console.log(`Role: ${newUser.role}`);
  } catch (error) {
    console.error('Error creating user:', error.message);
  }
}

// Function to change password
async function changePassword(username, newPassword) {
  try {
    const hashedPassword = await hashPassword(newPassword);
    
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully!');
    console.log(`Username: ${updatedUser.username}`);
  } catch (error) {
    console.error('Error updating password:', error.message);
  }
}

// Function to deactivate user
async function deactivateUser(username) {
  try {
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { isActive: false }
    });
    
    console.log('✅ User deactivated successfully!');
    console.log(`Username: ${updatedUser.username}`);
  } catch (error) {
    console.error('Error deactivating user:', error.message);
  }
}

// Main function to handle commands
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'list':
      await listUsers();
      break;
      
    case 'add':
      const username = process.argv[3];
      const fullName = process.argv[4];
      const password = process.argv[5];
      const role = process.argv[6] || 'USER';
      
      if (!username || !fullName || !password) {
        console.log('Usage: node manage-users.js add <username> <fullName> <password> [role]');
        console.log('Example: node manage-users.js add john "John Doe" mypassword123 ADMIN');
        return;
      }
      
      await addUser(username, fullName, password, role);
      break;
      
    case 'password':
      const userToUpdate = process.argv[3];
      const newPass = process.argv[4];
      
      if (!userToUpdate || !newPass) {
        console.log('Usage: node manage-users.js password <username> <newPassword>');
        console.log('Example: node manage-users.js password admin newpassword123');
        return;
      }
      
      await changePassword(userToUpdate, newPass);
      break;
      
    case 'deactivate':
      const userToDeactivate = process.argv[3];
      
      if (!userToDeactivate) {
        console.log('Usage: node manage-users.js deactivate <username>');
        console.log('Example: node manage-users.js deactivate olduser');
        return;
      }
      
      await deactivateUser(userToDeactivate);
      break;
      
    default:
      console.log('🔧 User Management Commands:');
      console.log('============================');
      console.log('node manage-users.js list                    - List all users');
      console.log('node manage-users.js add <username> <fullName> <password> [role] - Add new user');
      console.log('node manage-users.js password <username> <newPassword> - Change password');
      console.log('node manage-users.js deactivate <username>   - Deactivate user');
      console.log('');
      console.log('Examples:');
      console.log('node manage-users.js add john "John Doe" mypassword123 ADMIN');
      console.log('node manage-users.js password admin newpassword123');
      console.log('node manage-users.js deactivate olduser');
      break;
  }
  
  await prisma.$disconnect();
}

main();
