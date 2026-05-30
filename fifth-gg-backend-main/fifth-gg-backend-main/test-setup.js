#!/usr/bin/env node

/**
 * Simple test script to verify the backend setup
 * Run with: node test-setup.js
 */

const http = require('http');

console.log('🧪 Testing Fifth.gg Backend Setup...\n');

// Test 1: Check if server is running
function testServerRunning() {
    return new Promise((resolve, reject) => {
        console.log('Test 1: Checking if server is running...');

        const req = http.get('http://localhost:4000', (res) => {
            console.log('✅ Server is running on port 4000\n');
            resolve(true);
        });

        req.on('error', (err) => {
            console.log('❌ Server is NOT running');
            console.log('   Please start the server with: npm run dev\n');
            resolve(false);
        });

        req.setTimeout(2000, () => {
            req.destroy();
            console.log('❌ Server connection timeout\n');
            resolve(false);
        });
    });
}

// Test 2: Check database connection
async function testDatabaseConnection() {
    console.log('Test 2: Checking database connection...');

    try {
        const db = require('./src/config/db');
        const result = await db.query('SELECT NOW()');
        console.log('✅ Database connection successful');
        console.log(`   Current time: ${result.rows[0].now}\n`);
        return true;
    } catch (err) {
        console.log('❌ Database connection failed');
        console.log(`   Error: ${err.message}`);
        console.log('   Make sure PostgreSQL is running: docker-compose up -d\n');
        return false;
    }
}

// Test 3: Check if migrations have been run
async function testMigrations() {
    console.log('Test 3: Checking if migrations have been run...');

    try {
        const db = require('./src/config/db');

        // Check if users table exists
        const result = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'availability', 'matches', 'user_ranks')
      ORDER BY table_name
    `);

        const tables = result.rows.map(r => r.table_name);

        if (tables.length === 4) {
            console.log('✅ All migrations have been run');
            console.log(`   Tables found: ${tables.join(', ')}\n`);
            return true;
        } else {
            console.log('❌ Some migrations are missing');
            console.log(`   Found ${tables.length}/4 tables: ${tables.join(', ')}`);
            console.log('   Run migrations with: npm run migrate\n');
            return false;
        }
    } catch (err) {
        console.log('❌ Could not check migrations');
        console.log(`   Error: ${err.message}\n`);
        return false;
    }
}

// Test 4: Check Firebase configuration
function testFirebaseConfig() {
    console.log('Test 4: Checking Firebase configuration...');

    try {
        require('dotenv').config();

        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || projectId === 'your-project-id') {
            console.log('⚠️  Firebase not configured properly');
            console.log('   FIREBASE_PROJECT_ID is missing or using placeholder');
            console.log('   Update your .env file with real Firebase credentials\n');
            return false;
        }

        if (!clientEmail || clientEmail.includes('your-service-account')) {
            console.log('⚠️  Firebase not configured properly');
            console.log('   FIREBASE_CLIENT_EMAIL is missing or using placeholder\n');
            return false;
        }

        if (!privateKey || privateKey.includes('...')) {
            console.log('⚠️  Firebase not configured properly');
            console.log('   FIREBASE_PRIVATE_KEY is missing or using placeholder\n');
            return false;
        }

        console.log('✅ Firebase configuration looks good');
        console.log(`   Project ID: ${projectId}\n`);
        return true;
    } catch (err) {
        console.log('❌ Error checking Firebase config');
        console.log(`   Error: ${err.message}\n`);
        return false;
    }
}

// Run all tests
async function runTests() {
    const results = {
        server: false,
        database: false,
        migrations: false,
        firebase: false,
    };

    // Test Firebase first (doesn't require server)
    results.firebase = testFirebaseConfig();

    // Test database
    results.database = await testDatabaseConnection();

    if (results.database) {
        results.migrations = await testMigrations();
    }

    // Test server last
    results.server = await testServerRunning();

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('📊 Test Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`Server Running:    ${results.server ? '✅' : '❌'}`);
    console.log(`Database:          ${results.database ? '✅' : '❌'}`);
    console.log(`Migrations:        ${results.migrations ? '✅' : '❌'}`);
    console.log(`Firebase Config:   ${results.firebase ? '✅' : '⚠️'}`);
    console.log('═══════════════════════════════════════\n');

    const allPassed = results.server && results.database && results.migrations;

    if (allPassed && results.firebase) {
        console.log('🎉 All tests passed! Your backend is ready to use.\n');
    } else if (allPassed && !results.firebase) {
        console.log('⚠️  Backend is running but Firebase needs configuration.\n');
        console.log('Next steps:');
        console.log('1. Add real Firebase credentials to .env');
        console.log('2. Test authentication with a Firebase token\n');
    } else {
        console.log('❌ Some tests failed. Please fix the issues above.\n');
        console.log('Quick fixes:');
        if (!results.database) {
            console.log('• Start PostgreSQL: docker-compose up -d');
        }
        if (!results.migrations) {
            console.log('• Run migrations: npm run migrate');
        }
        if (!results.server) {
            console.log('• Start server: npm run dev');
        }
        console.log('');
    }

    process.exit(allPassed ? 0 : 1);
}

// Run the tests
runTests().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
