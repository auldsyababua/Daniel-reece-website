#!/usr/bin/env node
/**
 * Simple Node.js webhook proxy server to test Zapier integration
 * This bypasses CORS issues by running on your local machine
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors node-fetch
 * 2. Run server: node webhook-proxy-server.js
 * 3. Update your form to use: http://localhost:3001/webhook
 * 4. Test form submissions
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Your Zapier webhook URL
const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/22469845/u4jrg6c/';

// Enable CORS for all routes
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhook proxy endpoint
app.all('/webhook', async (req, res) => {
    console.log('\n🔄 Webhook proxy request received:');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    try {
        // Combine body and query data
        const data = {
            ...req.query,
            ...req.body,
            proxy_timestamp: new Date().toISOString(),
            proxy_method: req.method,
            proxy_source: 'Local Webhook Proxy',
            original_ip: req.ip,
            user_agent: req.headers['user-agent']
        };
        
        console.log('\n📤 Forwarding to Zapier:', ZAPIER_WEBHOOK_URL);
        console.log('Data:', JSON.stringify(data, null, 2));
        
        // Forward to Zapier webhook
        const response = await fetch(ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WebhookProxy/1.0'
            },
            body: JSON.stringify(data)
        });
        
        const responseText = await response.text();
        
        console.log('\n📥 Zapier response:');
        console.log('Status:', response.status);
        console.log('Response:', responseText);
        
        if (response.ok) {
            res.status(200).json({
                success: true,
                message: 'Data forwarded to Zapier successfully',
                zapier_response: JSON.parse(responseText),
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(response.status).json({
                success: false,
                error: 'Zapier webhook failed',
                status: response.status,
                response: responseText
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
        zapier_webhook: ZAPIER_WEBHOOK_URL
    });
});

// Root endpoint with instructions
app.get('/', (req, res) => {
    res.json({
        message: 'Webhook Proxy Server',
        endpoints: {
            webhook: '/webhook (POST/GET) - Forwards data to Zapier',
            health: '/health - Health check'
        },
        zapier_webhook: ZAPIER_WEBHOOK_URL,
        instructions: [
            '1. Update your form action to: http://localhost:3001/webhook',
            '2. Submit form data',
            '3. Check console logs for forwarding details',
            '4. Check Zapier dashboard for received data'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`
🚀 Webhook Proxy Server running on http://localhost:${PORT}

📋 Configuration:
   • Proxy endpoint: http://localhost:${PORT}/webhook
   • Zapier webhook: ${ZAPIER_WEBHOOK_URL}
   • CORS enabled for all origins

🧪 Testing:
   1. Update your form to use: http://localhost:${PORT}/webhook
   2. Or test directly:
      curl -X POST http://localhost:${PORT}/webhook \\
        -H "Content-Type: application/json" \\
        -d '{"name":"Test","email":"test@example.com","message":"Hello"}'

📊 Monitor this console for request logs
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔌 Webhook proxy server shutting down...');
    process.exit(0);
});