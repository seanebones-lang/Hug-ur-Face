/**
 * Comprehensive End-to-End Test for AI Image Editor
 * Tests all user flows including authentication, password reset, and legal pages
 */

const BASE_URL = process.env.TEST_URL || 'https://pic.mothership-ai.com';
const TEST_EMAIL_PREFIX = 'test_' + Date.now();

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'magenta');
  console.log('='.repeat(60) + '\n');
}

async function test(name, fn) {
  try {
    process.stdout.write(`Testing: ${name}... `);
    await fn();
    log('✅ PASS', 'green');
    return true;
  } catch (error) {
    log('❌ FAIL', 'red');
    log(`  Error: ${error.message}`, 'red');
    return false;
  }
}

// Test data
let testUser = {
  email: `${TEST_EMAIL_PREFIX}@example.com`,
  password: 'TestPassword123!',
  name: 'Test User',
};

let verificationToken = null;
let resetToken = null;
let sessionCookie = null;

// Helper to make requests
async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (sessionCookie) {
    headers['Cookie'] = sessionCookie;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Capture session cookie
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    sessionCookie = setCookie.split(';')[0];
  }

  return response;
}

// Test Suite
async function runTests() {
  let passed = 0;
  let failed = 0;

  section('1. Testing Legal Pages');

  const legalPages = [
    '/privacy',
    '/terms',
    '/acceptable-use',
    '/disclaimer',
    '/faq',
  ];

  for (const page of legalPages) {
    const success = await test(`Legal page ${page}`, async () => {
      const response = await makeRequest(page);
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
    });
    success ? passed++ : failed++;
  }

  section('2. Testing Signup Flow');

  // Test 2.1: Signup with new account
  let success = await test('Signup with new user', async () => {
    const response = await makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    if (!data.success) {
      throw new Error('Signup did not return success');
    }
  });
  success ? passed++ : failed++;

  // Test 2.2: Try to login without email verification
  success = await test('Login rejected for unverified email', async () => {
    const response = await makeRequest('/api/auth/callback/credentials', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    // Should fail because email not verified
    if (response.ok) {
      throw new Error('Login should be rejected for unverified email');
    }
  });
  success ? passed++ : failed++;

  // Test 2.3: Test IP rate limiting (try to create 4 accounts)
  success = await test('IP rate limiting (3 accounts max)', async () => {
    log('\n  Creating additional test accounts...', 'yellow');

    // Create 2 more accounts (total 3 including first one)
    for (let i = 2; i <= 3; i++) {
      const email = `${TEST_EMAIL_PREFIX}_${i}@example.com`;
      const response = await makeRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password: 'TestPass123!',
          name: `Test User ${i}`,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(`Account ${i} creation failed`);
      }
      log(`  ✓ Created account ${i}`, 'blue');
    }

    // Try to create 4th account - should be rate limited
    const response = await makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: `${TEST_EMAIL_PREFIX}_4@example.com`,
        password: 'TestPass123!',
        name: 'Test User 4',
      }),
    });

    if (response.status !== 429) {
      throw new Error(`Expected 429 rate limit, got ${response.status}`);
    }

    log('  ✓ 4th account correctly blocked (429)', 'blue');
  });
  success ? passed++ : failed++;

  section('3. Testing Email Verification');

  // Note: In production, we'd need to extract token from email
  // For testing, we'll query the database directly
  log('⚠️  Manual step required:', 'yellow');
  log('  1. Check email at: ' + testUser.email, 'yellow');
  log('  2. Or query database for verification token', 'yellow');
  log('  Skipping email verification test (requires email access)', 'yellow');

  section('4. Testing Forgot Password Flow');

  // Test 4.1: Request password reset
  success = await test('Request password reset', async () => {
    const response = await makeRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Forgot password failed');
    }

    if (!data.success) {
      throw new Error('Forgot password did not return success');
    }
  });
  success ? passed++ : failed++;

  // Test 4.2: Request reset for non-existent email (should still return success)
  success = await test('Forgot password with non-existent email', async () => {
    const response = await makeRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
      }),
    });

    const data = await response.json();

    // Should return success to prevent email enumeration
    if (!response.ok || !data.success) {
      throw new Error('Should return success even for non-existent email');
    }
  });
  success ? passed++ : failed++;

  log('\n⚠️  Manual step required for password reset:', 'yellow');
  log('  1. Check email for reset token', 'yellow');
  log('  2. Or query database for resetToken', 'yellow');
  log('  Skipping password reset completion test', 'yellow');

  section('5. Testing API Endpoints');

  // Test 5.1: Homepage loads
  success = await test('Homepage loads', async () => {
    const response = await makeRequest('/');
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
  });
  success ? passed++ : failed++;

  // Test 5.2: Sign in page loads
  success = await test('Sign in page loads', async () => {
    const response = await makeRequest('/auth/signin');
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
  });
  success ? passed++ : failed++;

  // Test 5.3: Pricing page loads
  success = await test('Pricing page loads', async () => {
    const response = await makeRequest('/pricing');
    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }
  });
  success ? passed++ : failed++;

  section('6. Summary');

  const total = passed + failed;
  log(`\nTotal Tests: ${total}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`, 'blue');

  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review above.', 'yellow');
  }

  section('7. Manual Testing Checklist');

  log('Complete these steps manually:', 'yellow');
  log('', 'reset');
  log('✅ 1. Create account at: ' + BASE_URL + '/auth/signin', 'reset');
  log('✅ 2. Check email for verification link', 'reset');
  log('✅ 3. Click verification link', 'reset');
  log('✅ 4. Verify you received 3 free credits', 'reset');
  log('✅ 5. Log in successfully', 'reset');
  log('✅ 6. Test "Forgot Password" flow', 'reset');
  log('✅ 7. Reset password and login with new password', 'reset');
  log('✅ 8. Try to create 4th account from same IP (should fail)', 'reset');
  log('✅ 9. Generate an image (if HuggingFace Space is upgraded)', 'reset');
  log('✅ 10. Check all legal pages load correctly', 'reset');

  section('8. Database Queries for Manual Verification');

  log('Run these queries to verify data:', 'blue');
  log('', 'reset');
  log('-- Check user was created', 'reset');
  log(`SELECT id, email, emailVerified, imageCredits, signupIp FROM "User" WHERE email = '${testUser.email}';`, 'reset');
  log('', 'reset');
  log('-- Check signup attempts from IP', 'reset');
  log(`SELECT COUNT(*) as count FROM "SignupAttempt" WHERE success = true AND createdAt > NOW() - INTERVAL '30 days';`, 'reset');
  log('', 'reset');
  log('-- Check verification token', 'reset');
  log(`SELECT token, expires FROM "VerificationToken" WHERE identifier = '${testUser.email}';`, 'reset');
  log('', 'reset');
  log('-- Check reset token', 'reset');
  log(`SELECT resetToken, resetTokenExpiry FROM "User" WHERE email = '${testUser.email}';`, 'reset');

  return failed === 0 ? 0 : 1;
}

// Run tests
log('\n🚀 Starting comprehensive end-to-end tests...', 'blue');
log(`Testing URL: ${BASE_URL}\n`, 'blue');

runTests()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    log('\n❌ Test suite crashed:', 'red');
    console.error(error);
    process.exit(1);
  });
