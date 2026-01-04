/**
 * Script to create 3 test users
 * Run with: node src/scripts/createTestUsers.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../model/User');

const testUsers = [
  {
    email: "test1@gmail.com",
    password: "password",
    firstName: "Test",
    lastName: "User1"
  },
  {
    email: "test2@gmail.com", 
    password: "password",
    firstName: "Test",
    lastName: "User2"
  },
  {
    email: "test3@gmail.com",
    password: "password", 
    firstName: "Test",
    lastName: "User3"
  }
];

async function createTestUsers() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI not found in environment variables.');
      process.exit(1);
    }
    
    console.log('🔌 Connecting to MongoDB...');
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully\n');

    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        email: userData.email.toLowerCase(),
        passwordHash: passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user',
        isEmailVerified: true
      });

      console.log(`✅ User ${i + 1} created successfully!`);
      console.log(`📧 Email: ${userData.email}`);
      console.log(`🔑 Password: ${userData.password}`);
      console.log(`👤 Name: ${userData.firstName} ${userData.lastName}\n`);
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating test users:', error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

createTestUsers();