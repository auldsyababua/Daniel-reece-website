# n8n Airtable Configuration

## Your Airtable Details

**Base ID**: `appXk9QepZD7Riwyl`
**Base Name**: ExecutiveSpeechCoachingNYC.com Client Management
**Table**: `Clients` (not "Leads")
**API Token**: `REDACTED_AIRTABLE_PAT`

## Available Tables in Your Base:
1. **Clients** - Main client records
2. **Sessions** - Coaching sessions
3. **Progress Reports** - Client progress tracking
4. **Feedback** - Client feedback
5. **Invoices** - Billing records
6. **Sales** - Sales transactions
7. **Referrals** - Client referrals
8. **Automation Rules** - Automation settings
9. **Goals** - Client goals
10. **Automation Log** - Automation activity log

## Field Mapping for "Clients" Table

When setting up n8n, map your webhook fields to these Airtable fields:

### In n8n Airtable Node:

**Resource**: Record
**Operation**: Create
**Base ID**: `appXk9QepZD7Riwyl`
**Table**: Select "Clients" from dropdown

### Field Mappings:

| Webhook Field | Airtable Field | Expression in n8n |
|--------------|----------------|-------------------|
| name | Client Name | `{{$json["name"]}}` |
| email | Contact Details | `{{$json["email"]}}` |
| message | Personal Preferences | `{{$json["message"]}}` |
| timestamp | (Create in Automation Log) | Use separate node |

## Creating the Automation Log Entry

After creating the client record, add another Airtable node to log the automation:

**Table**: Automation Log
**Fields**:
- **Event Type**: "Lead Created"
- **Client**: Link to the created client record
- **Details**: `{{$json["subject"]}} - {{$json["message"]}}`
- **Success**: true
- **Source**: "Website Form"
- **Timestamp**: `{{$json["timestamp"]}}`

## Test Command with Correct Table:

```bash
curl -X POST "https://api.airtable.com/v0/appXk9QepZD7Riwyl/Clients" \
  -H "Authorization: Bearer REDACTED_AIRTABLE_PAT" \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {
        "fields": {
          "Client Name": "Test User from n8n",
          "Contact Details": "test@example.com | Phone: 555-1234",
          "Personal Preferences": "Interested in Executive Presence Coaching"
        }
      }
    ]
  }'
```

## Important Notes:
1. Your table is called **"Clients"**, not "Leads"
2. The email field is part of **"Contact Details"** (seems to be a text field)
3. There's no direct "Email" field - you'll combine email/phone in "Contact Details"
4. Use the **Automation Log** table to track all form submissions