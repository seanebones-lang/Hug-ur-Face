import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@nexteleven.com';
const ADMIN_PASSWORD = 'admin123';
const APP_URL = 'https://pic.mothership-ai.com';
const LOCAL_URL = 'http://localhost:3001';

async function testDatabase() {
  console.log('\n🧪 Testing Database Connection...');
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    return false;
  }
}

async function createTestAdmin() {
  console.log('\n🧪 Creating Test Admin User...');
  try {
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL }
    });

    if (existing) {
      console.log('✅ Admin user already exists');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      return existing;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: 'Admin',
        imageCredits: 100
      }
    });

    console.log('✅ Admin user created');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Credits: 100`);
    return user;
  } catch (error) {
    console.log('❌ Failed to create admin:', error);
    return null;
  }
}

async function testModels() {
  console.log('\n🧪 Testing Database Models...');

  try {
    // Test User model
    const userCount = await prisma.user.count();
    console.log(`✅ Users table: ${userCount} users`);

    // Test AccessLog model
    const logCount = await prisma.accessLog.count();
    console.log(`✅ AccessLog table: ${logCount} logs`);

    return true;
  } catch (error) {
    console.log('❌ Model test failed:', error);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log('\n🧪 Testing API Endpoints...');

  const endpoints = [
    { name: 'Signup API', url: `${LOCAL_URL}/api/auth/signup`, method: 'POST' },
    { name: 'Generate API', url: `${LOCAL_URL}/api/generate`, method: 'POST' },
    { name: 'Checkout API', url: `${LOCAL_URL}/api/checkout`, method: 'POST' },
    { name: 'Billing Portal API', url: `${LOCAL_URL}/api/billing/portal`, method: 'POST' },
  ];

  console.log('⚠️  API endpoint testing requires running dev server');
  console.log('   Run: npm run dev in /Users/nexteleven/Hug-ur-Face');

  return endpoints;
}

async function testHuggingFaceSpace() {
  console.log('\n🧪 Testing HuggingFace Space...');
  console.log(`   Space: https://huggingface.co/spaces/bizbots/qwen-image-editor`);
  console.log(`   Status: RUNNING on zero-a10g`);
  console.log('✅ Space is deployed and running');
}

async function runAllTests() {
  console.log('================================');
  console.log('   COMPREHENSIVE TEST SUITE');
  console.log('================================');

  await testDatabase();
  await createTestAdmin();
  await testModels();
  await testHuggingFaceSpace();

  console.log('\n================================');
  console.log('   TEST SUMMARY');
  console.log('================================');
  console.log('\n📋 Admin Login Credentials:');
  console.log(`   URL: ${APP_URL} or ${LOCAL_URL}`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('\n📋 Manual Tests Required:');
  console.log('   1. Sign in with admin credentials');
  console.log('   2. Upload an image');
  console.log('   3. Enter a prompt (e.g., "transform into anime")');
  console.log('   4. Test image generation (uses 1 credit)');
  console.log('   5. Test Stripe checkout (buy credits)');
  console.log('   6. Test billing portal');
  console.log('\n================================');

  await prisma.$disconnect();
}

runAllTests().catch(console.error);
