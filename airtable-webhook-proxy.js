#!/usr/bin/env node
/**
 * Direct Airtable integration webhook proxy
 * This bypasses n8n webhook registration issues by directly integrating with Airtable API
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors node-fetch
 * 2. Run server: node airtable-webhook-proxy.js
 * 3. Update form to use: http://localhost:3002/webhook
 * 4. Test form submissions
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3002;

// Airtable Configuration
const AIRTABLE_BASE_ID = 'appXk9QepZD7Riwyl';
const AIRTABLE_TABLE_NAME = 'Clients';
const AIRTABLE_API_KEY = 'patUK65zm8XZuBECT.68e4c4d28ff6aa50aa6518e687915500bb70dd57cd973d06be4eafed024ff3c2';
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

// Enable CORS for all routes
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook endpoint
app.all('/webhook', async (req, res) => {
    console.log('\n🔄 Webhook request received:');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    try {
        // Combine body and query data
        const formData = {
            ...req.query,
            ...req.body
        };
        
        console.log('\n📝 Processing form data:', JSON.stringify(formData, null, 2));
        
        // Map form data to Airtable fields
        const airtableRecord = {
            fields: {
                "Name": formData.name || 'Unknown',
                "Email": formData.email || '',
                "Subject": formData.subject || 'No subject',
                "Message": formData.message || '',
                "Submission Date": formData.timestamp || new Date().toISOString(),
                "Lead Status": "New",
                "Lead Source": formData.source || "Website Contact Form"
            }
        };
        
        console.log('\n📤 Sending to Airtable:', AIRTABLE_API_URL);
        console.log('Record:', JSON.stringify(airtableRecord, null, 2));
        
        // Send to Airtable
        const response = await fetch(AIRTABLE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(airtableRecord)
        });
        
        const responseData = await response.json();
        
        console.log('\n📥 Airtable response:');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(responseData, null, 2));
        
        if (response.ok) {
            res.status(200).json({
                success: true,
                message: 'Data saved to Airtable successfully',
                airtable_record_id: responseData.id,
                airtable_response: responseData,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(response.status).json({
                success: false,
                error: 'Airtable API error',
                status: response.status,
                response: responseData
            });
        }
        
    } catch (error) {
        console.error('\n❌ Proxy error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        airtable_base: AIRTABLE_BASE_ID,
        airtable_table: AIRTABLE_TABLE_NAME
    });
});

// Root endpoint with instructions
app.get('/', (req, res) => {
    res.json({
        message: 'Airtable Webhook Proxy Server',
        endpoints: {
            webhook: '/webhook (POST/GET) - Saves data directly to Airtable',
            health: '/health - Health check'
        },
        airtable_config: {
            base_id: AIRTABLE_BASE_ID,
            table_name: AIRTABLE_TABLE_NAME
        },
        instructions: [
            '1. Update your form action to: http://localhost:3002/webhook',
            '2. Submit form data',
            '3. Check console logs for processing details',
            '4. Check Airtable for new records'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`
🚀 Airtable Webhook Proxy Server running on http://localhost:${PORT}

📋 Configuration:
   • Proxy endpoint: http://localhost:${PORT}/webhook
   • Airtable Base: ${AIRTABLE_BASE_ID}
   • Airtable Table: ${AIRTABLE_TABLE_NAME}
   • CORS enabled for all origins

🧪 Testing:
   1. Update your form to use: http://localhost:${PORT}/webhook
   2. Or test directly:
      curl -X POST http://localhost:${PORT}/webhook \\
        -H "Content-Type: application/json" \\
        -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"Hello from Airtable proxy"}'

📊 Monitor this console for request logs
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔌 Airtable webhook proxy server shutting down...');
    process.exit(0);
});