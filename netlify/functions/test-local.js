#!/usr/bin/env node

// Simple test script for local function testing
// Usage: node test-local.js [function-name] [test-type]

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:8888/.netlify/functions';

const testData = {
  'contact-form': {
    basic: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message from the local test script',
    },
    full: {
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1-555-0123',
      company: 'Test Company Inc.',
      message: 'I am interested in executive coaching for my team. We have about 10 executives who need presentation skills training.',
      serviceInterest: 'Group Communication Training',
      referralSource: 'LinkedIn',
    },
  },
  'newsletter-signup': {
    basic: {
      email: 'newsletter@example.com',
    },
    full: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      interests: ['Public Speaking', 'Executive Presence', 'Storytelling'],
      referralSource: 'Blog Post',
    },
  },
  'webhook-receiver': {
    stripe: {
      type: 'stripe.payment_intent.succeeded',
      payload: {
        id: 'pi_test_123456',
        amount: 50000,
        currency: 'usd',
        receipt_email: 'customer@example.com',
        metadata: {
          service: 'Executive Coaching Session',
        },
      },
    },
    calendar: {
      type: 'calendar.event.created',
      payload: {
        clientEmail: 'client@example.com',
        eventDate: new Date().toISOString(),
        sessionType: 'Discovery Call',
        duration: 30,
        location: 'Zoom',
        eventId: 'cal_test_123',
      },
    },
  },
};

async function makeRequest(endpoint, data) {
  const url = `${BASE_URL}/${endpoint}`;
  const postData = JSON.stringify(data);
  
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    
    const req = http.request(url, options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log(`\\nResponse Status: ${res.statusCode}`);
        console.log('Response Headers:', res.headers);
        console.log('\\nResponse Body:');
        try {
          const parsed = JSON.parse(body);
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log(body);
        }
        resolve();
      });
    });
    
    req.on('error', (e) => {
      console.error(`Request failed: ${e.message}`);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  const [,, functionName, testType = 'basic'] = process.argv;
  
  if (!functionName || !testData[functionName]) {
    console.log('Usage: node test-local.js [function-name] [test-type]');
    console.log('\\nAvailable functions:');
    Object.keys(testData).forEach(fn => {
      console.log(`  - ${fn}`);
      console.log(`    Test types: ${Object.keys(testData[fn]).join(', ')}`);
    });
    process.exit(1);
  }
  
  const data = testData[functionName][testType];
  if (!data) {
    console.error(`No test data found for ${functionName} with type ${testType}`);
    console.log(`Available test types: ${Object.keys(testData[functionName]).join(', ')}`);
    process.exit(1);
  }
  
  console.log(`Testing ${functionName} with ${testType} data...`);
  console.log('\\nRequest Data:');
  console.log(JSON.stringify(data, null, 2));
  
  try {
    await makeRequest(functionName, data);
  } catch (error) {
    console.error('\\nTest failed:', error.message);
    process.exit(1);
  }
}

main();