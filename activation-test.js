#!/usr/bin/env node

/**
 * Test script to verify webhook activation after n8n workflow is activated
 */

const https = require('https');

function testWebhook() {
    const testEvent = {
        type: 'invoice.created',
        data: {
            object: {
                id: 'in_activation_test_' + Date.now(),
                customer: 'cus_test_activation',
                customer_email: 'activation-test@danielreece.coach',
                amount_due: 50000, // $500.00
                currency: 'usd',
                status: 'open',
                created: Math.floor(Date.now() / 1000),
                description: 'Executive Coaching Session - Activation Test'
            }
        }
    };

    const postData = JSON.stringify(testEvent);

    const options = {
        hostname: 'n8n-rrrs.sliplane.app',
        port: 443,
        REDACTED_AIRTABLE_PAT: '/webhook/stripe',  // Production webhook REDACTED_AIRTABLE_PAT
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)'
        }
    };

    console.log('🧪 Testing activated webhook...\n');

    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Response: ${data}`);
            
            if (res.statusCode === 200) {
                console.log('\n🎉 SUCCESS! Webhook is activated and working!');
                console.log('✅ Your Stripe invoice automation is now fully functional');
                console.log('\n📝 Next steps:');
                console.log('1. Configure the actual Stripe webhook endpoint in your dashboard');
                console.log('2. Point it to: https://n8n-rrrs.sliplane.app/webhook/stripe');
                console.log('3. Select invoice.* events');
                console.log('4. Test with real invoices!');
            } else {
                console.log('\n⚠️  Webhook not yet activated in n8n');
                console.log('Please activate the workflow in the n8n UI first');
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ Request error:', err.message);
    });

    req.write(postData);
    req.end();
}

testWebhook();