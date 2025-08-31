#!/usr/bin/env node

/**
 * Stripe Invoice Automation Testing Script
 * 
 * This script simulates Stripe webhook events to test the n8n automation workflow
 * It sends test events to the configured webhook endpoint
 */

const https = require('https');

// Configuration - can be overridden with environment variable
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://n8n-rrrs.sliplane.app/webhook/stripe';
const TEST_EVENTS = [
    {
        type: 'invoice.created',
        data: {
            object: {
                id: 'in_test_invoice_created_123',
                customer: 'cus_test_customer_456',
                customer_email: 'test.client@example.com',
                amount_due: 15000, // $150.00 in cents
                currency: 'usd',
                status: 'draft',
                created: Math.floor(Date.now() / 1000),
                description: 'Executive Coaching Session - Test Invoice Created'
            }
        }
    },
    {
        type: 'invoice.finalized',
        data: {
            object: {
                id: 'in_test_invoice_finalized_456',
                customer: 'cus_test_customer_789',
                customer_email: 'another.client@example.com',
                amount_due: 25000, // $250.00 in cents
                currency: 'usd',
                status: 'open',
                created: Math.floor(Date.now() / 1000),
                description: 'Leadership Development Program - Test Invoice Finalized'
            }
        }
    },
    {
        type: 'invoice.sent',
        data: {
            object: {
                id: 'in_test_invoice_sent_789',
                customer: 'cus_test_customer_101',
                customer_email: 'client.three@example.com',
                amount_due: 30000, // $300.00 in cents
                currency: 'usd',
                status: 'open',
                created: Math.floor(Date.now() / 1000),
                description: 'Career Coaching Package - Test Invoice Sent'
            }
        }
    },
    {
        type: 'invoice.payment_succeeded',
        data: {
            object: {
                id: 'in_test_payment_succeeded_101',
                customer: 'cus_test_customer_202',
                customer_email: 'paid.client@example.com',
                amount_due: 20000, // $200.00 in cents
                currency: 'usd',
                status: 'paid',
                created: Math.floor(Date.now() / 1000),
                description: 'Strategic Planning Session - Test Payment Succeeded'
            }
        }
    },
    {
        type: 'invoice.payment_failed',
        data: {
            object: {
                id: 'in_test_payment_failed_202',
                customer: 'cus_test_customer_303',
                customer_email: 'failed.payment@example.com',
                amount_due: 17500, // $175.00 in cents
                currency: 'usd',
                status: 'open',
                created: Math.floor(Date.now() / 1000),
                description: 'Team Coaching Workshop - Test Payment Failed'
            }
        }
    }
];

/**
 * Send webhook event to n8n
 * @param {Object} event - The Stripe event to send
 * @param {number} delay - Delay in milliseconds before sending
 * @returns {Promise}
 */
function sendWebhookEvent(event, delay = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const postData = JSON.stringify(event);
            
            const options = {
                hostname: 'n8n-rrrs.sliplane.app',
                port: 443,
                path: '/webhook/stripe',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
                    'Stripe-Signature': 'test-signature' // In production, this would be a real signature
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    console.log(`✅ Event ${event.type} sent successfully (Status: ${res.statusCode})`);
                    console.log(`   Invoice ID: ${event.data.object.id}`);
                    console.log(`   Customer: ${event.data.object.customer_email}`);
                    console.log(`   Amount: $${(event.data.object.amount_due / 100).toFixed(2)}`);
                    console.log(`   Response: ${data}\n`);
                    resolve(data);
                });
            });

            req.on('error', (err) => {
                console.error(`❌ Error sending ${event.type}:`, err.message);
                reject(err);
            });

            req.write(postData);
            req.end();
        }, delay);
    });
}

/**
 * Run the test suite
 */
async function runTests() {
    console.log('🚀 Starting Stripe Invoice Automation Test Suite\n');
    console.log(`📡 Target webhook URL: ${WEBHOOK_URL}\n`);
    
    try {
        for (let i = 0; i < TEST_EVENTS.length; i++) {
            const event = TEST_EVENTS[i];
            console.log(`📤 Sending test event ${i + 1}/${TEST_EVENTS.length}: ${event.type}`);
            
            await sendWebhookEvent(event, i * 2000); // 2 second delay between events
        }
        
        console.log('✅ All test events sent successfully!');
        console.log('\n📝 Check the following to verify the automation:');
        console.log('   1. Airtable "Invoices" table for new records');
        console.log('   2. Daniel\'s email (daniel@danielreece.coach) for payment notifications');
        console.log('   3. n8n workflow execution logs at https://n8n-rrrs.sliplane.app');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        process.exit(1);
    }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Stripe Invoice Automation Test Suite');
    console.log('');
    console.log('Usage: node stripe-webhook-test.js [options]');
    console.log('       WEBHOOK_URL=https://hooks.zapier.com/... node stripe-webhook-test.js');
    console.log('');
    console.log('Options:');
    console.log('  --help, -h     Show this help message');
    console.log('  --single TYPE  Send only one event of specified type');
    console.log('');
    console.log('Environment Variables:');
    console.log('  WEBHOOK_URL    Override the default webhook URL');
    console.log('                 Default: https://n8n-rrrs.sliplane.app/webhook/stripe');
    console.log('');
    console.log('Available event types:');
    TEST_EVENTS.forEach(event => console.log(`  - ${event.type}`));
    console.log('');
    console.log('Examples:');
    console.log('  # Test with n8n (default)');
    console.log('  node stripe-webhook-test.js');
    console.log('');
    console.log('  # Test with Zapier');
    console.log('  WEBHOOK_URL=https://hooks.zapier.com/... node stripe-webhook-test.js');
    console.log('');
    console.log('  # Test single event with custom URL');
    console.log('  WEBHOOK_URL=https://your-webhook.com node stripe-webhook-test.js --single invoice.created');
    process.exit(0);
}

// Handle single event testing
const singleEventIndex = process.argv.indexOf('--single');
if (singleEventIndex !== -1 && process.argv[singleEventIndex + 1]) {
    const eventType = process.argv[singleEventIndex + 1];
    const event = TEST_EVENTS.find(e => e.type === eventType);
    
    if (!event) {
        console.error(`❌ Unknown event type: ${eventType}`);
        console.log('Available types:', TEST_EVENTS.map(e => e.type).join(', '));
        process.exit(1);
    }
    
    console.log(`🧪 Testing single event: ${eventType}\n`);
    sendWebhookEvent(event).catch(console.error);
} else {
    // Run full test suite
    runTests();
}