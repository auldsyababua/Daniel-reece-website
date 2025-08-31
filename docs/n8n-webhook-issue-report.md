# n8n Webhook 404 Error - Issue Report

## Problem Statement

When attempting to set up Stripe invoice automation using n8n, the webhook endpoints are returning 404 errors despite having an active workflow created successfully via the n8n API.

## Environment Details

### n8n Instance
- **URL**: https://n8n-rrrs.sliplane.app
- **API Endpoint**: https://n8n-rrrs.sliplane.app/api/v1
- **Hosting**: Sliplane.app (cloud hosting)
- **Authentication**: JWT Token (expires Jan 2, 2025)

### Authentication Token
```
JWT Token: REDACTED_JWT
```

## Workflow Created Successfully

### Workflow Details
- **Name**: "Stripe Invoice Automation"
- **ID**: vsJ1Z0eWhcTXc23L
- **Status**: Active
- **Created via**: n8n API v1

### API Call That Succeeded
```bash
curl -X POST https://n8n-rrrs.sliplane.app/api/v1/workflows \
  -H "X-N8N-API-KEY: [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{workflow_json_with_webhook_node}'
```

**Response**: HTTP 201 - Workflow created successfully

## The Problem

### Expected Webhook URL
Based on n8n documentation, the webhook should be available at:
```
https://n8n-rrrs.sliplane.app/webhook/stripe
```

### Actual Behavior
When testing the webhook endpoint:
```bash
curl -X POST https://n8n-rrrs.sliplane.app/webhook/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"invoice.created","data":{"object":{...}}}'
```

**Response**: HTTP 404 - Not Found

## Webhook Node Configuration

The webhook node in the workflow is configured as:
```json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "position": [250, 300],
  "parameters": {
    "REDACTED_AIRTABLE_PAT": "stripe",
    "httpMethod": "POST",
    "responseMode": "onReceived",
    "responseData": "allEntries",
    "rawBody": true
  }
}
```

## Tests Performed

### 1. Verified Workflow Exists
```bash
curl -X GET https://n8n-rrrs.sliplane.app/api/v1/workflows/vsJ1Z0eWhcTXc23L \
  -H "X-N8N-API-KEY: [JWT_TOKEN]"
```
**Result**: Returns workflow JSON successfully

### 2. Confirmed Workflow is Active
```bash
curl -X POST https://n8n-rrrs.sliplane.app/api/v1/workflows/vsJ1Z0eWhcTXc23L/activate \
  -H "X-N8N-API-KEY: [JWT_TOKEN]"
```
**Result**: Returns {"active": true}

### 3. Tested Multiple Webhook Path Variations
- `/webhook/stripe` - 404
- `/webhook/vsJ1Z0eWhcTXc23L/stripe` - 404  
- `/webhook-test/stripe` - 404
- `/production/webhook/stripe` - 404

### 4. Checked n8n API for Webhook Endpoints
```bash
curl -X GET https://n8n-rrrs.sliplane.app/api/v1/webhooks \
  -H "X-N8N-API-KEY: [JWT_TOKEN]"
```
**Result**: Endpoint not available in API v1

## Possible Root Causes

### 1. Webhook URL Structure Issue
n8n may use a different URL structure for webhooks in Sliplane deployments:
- Production vs Test webhook REDACTED_AIRTABLE_PAT
- Workflow ID included in REDACTED_AIRTABLE_PAT
- Different subdomain for webhooks

### 2. Deployment Configuration
The Sliplane deployment might:
- Have webhooks disabled
- Use a different routing configuration
- Require additional activation steps
- Need webhook-specific authentication

### 3. Workflow Activation Issue
Despite API showing active=true:
- Webhook node might need separate activation
- Workflow might need to be opened in UI once
- Could require manual "Test" execution first

### 4. n8n Version/Feature Availability
- API v1 might not fully support webhook creation
- Sliplane deployment might have limited webhook features
- Could be a known issue with this n8n version

## Related Files and Dependencies

### Configuration Files
- `/Users/colinaulds/Desktop/projects/homelab-docs/claude-code-mcp-configuration.md` - MCP configuration with n8n details
- `~/.config/mcp/.env` - Environment variables including n8n credentials

### Created Files
- `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/STRIPE_AUTOMATION_SETUP.md`
- `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/stripe-webhook-test.js`

### MCP Configuration
```json
{
  "n8n-mcp": {
    "command": "npx",
    "args": ["n8n-mcp"],
    "env": {
      "N8N_API_URL": "https://n8n-rrrs.sliplane.app/api/v1",
      "N8N_API_KEY": "[JWT_TOKEN]",
      "MCP_MODE": "stdio",
      "LOG_LEVEL": "error"
    }
  }
}
```

## What We Need to Investigate

1. **Correct webhook URL format** for Sliplane-hosted n8n instances
2. **Whether webhooks need to be enabled** at the deployment level
3. **If there's a webhook registration process** beyond workflow creation
4. **The proper way to get webhook URLs** from the API
5. **Whether the n8n UI shows the webhook URL** when viewing the workflow

## Recommended Next Steps

1. **Access n8n UI directly** at https://n8n-rrrs.sliplane.app
   - Open workflow vsJ1Z0eWhcTXc23L
   - Check if webhook URL is displayed in the Webhook node
   - Try executing the workflow manually

2. **Check n8n documentation** for Sliplane deployments
   - Look for webhook-specific configuration
   - Check for known limitations

3. **Contact Sliplane support** or check their documentation
   - Ask about webhook routing configuration
   - Verify if webhooks are enabled on the instance

4. **Test with n8n's built-in webhook test**
   - Use the n8n UI to test the webhook
   - Check execution logs for any errors

## Summary

We have successfully created an n8n workflow with ID `vsJ1Z0eWhcTXc23L` via the API, but the webhook endpoint that should be automatically available at `https://n8n-rrrs.sliplane.app/webhook/stripe` is returning 404 errors. This appears to be a deployment/configuration issue rather than a problem with our workflow creation or API usage.

The core issue is: **How do we access/enable webhook endpoints for workflows created via API in a Sliplane-hosted n8n instance?**