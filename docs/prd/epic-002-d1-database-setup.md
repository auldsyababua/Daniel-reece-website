# Epic 2: D1 Database Setup & Airtable Migration

## Epic Goal
Create and configure Cloudflare D1 database with complete schema migration from the existing Airtable base, including all 11 tables, relationships, and data migration. Establish the foundation for the D1 Manager admin interface while preserving all business data and maintaining referential integrity.

## Business Value
- Eliminates monthly Airtable subscription costs (~$240/year)
- Provides foundation for unlimited database scaling within D1 limits
- Enables direct API access to business data for enhanced automation
- Creates unified data layer within Cloudflare ecosystem
- Maintains all existing client data relationships and business processes

## Database Migration Analysis

### Source: Airtable Base "ExecutiveSpeechCoachingNYC.com Client Management"
**Base ID**: appXk9QepZD7Riwyl  
**Total Tables**: 11  
**Total Relationships**: 15+ linked record fields

## User Stories

### Story 2.1: D1 Database Creation and Configuration
**As a** developer  
**I want** to create and configure a Cloudflare D1 database  
**So that** we have the infrastructure ready for data migration

#### Acceptance Criteria
1. Cloudflare D1 database created with name "dan-reece-coaching-db"
2. Database binding configured for local development
3. Wrangler CLI configured for database management
4. Database connection verified from both local and Cloudflare environments
5. Backup and restore procedures documented
6. Database limits and quotas understood and documented
7. Access controls and API tokens configured

#### Implementation Details
**Database Creation Commands:**
```bash
# Create the D1 database
npx wrangler d1 create dan-reece-coaching-db

# Output will provide database_id for wrangler.toml
```

**Wrangler Configuration (wrangler.toml):**
```toml
name = "dan-reece-site"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-database-id-from-create-command"
migrations_dir = "migrations"
```

**Local Development Setup:**
```bash
# Run migrations locally
npx wrangler d1 migrations apply dan-reece-coaching-db --local

# Start development server with D1 binding
npx wrangler dev --d1 DB=dan-reece-coaching-db
```

**Database Connection Test:**
```javascript
// Test connection in Worker
export default {
  async fetch(request, env) {
    const result = await env.DB.prepare("SELECT 1 as test").first()
    return new Response(JSON.stringify(result))
  }
}
```

### Story 2.2: Core Business Tables Schema Creation
**As a** data architect  
**I want** to create the primary business table schemas in D1  
**So that** client data can be stored with proper structure and relationships

#### Acceptance Criteria
1. **Clients table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - client_name (TEXT NOT NULL)
   - contact_details (TEXT)
   - personal_preferences (TEXT) 
   - profile_photo_url (TEXT)
   - schedules (TEXT)
   - zapier_log (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
   - updated_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

2. **Sessions table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - session_time (TEXT)
   - session_date (DATE)
   - topics_covered (TEXT)
   - session_photos_urls (TEXT) -- JSON array of URLs
   - schedules (TEXT)
   - zapier_log (TEXT)
   - resources (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
   - updated_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

3. **Progress_Reports table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - name (TEXT NOT NULL)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - session_id (INTEGER FOREIGN KEY → sessions.id)
   - report_date (DATE)
   - improvements (TEXT)
   - areas_for_development (TEXT)
   - overall_progress (TEXT CHECK (overall_progress IN ('Excellent', 'Good', 'Satisfactory', 'Needs Improvement')))
   - coach_feedback (TEXT)
   - attachments_urls (TEXT) -- JSON array of URLs
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
   - updated_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

4. Foreign key constraints properly defined and tested
5. Indexes created on frequently queried fields (client_id, session_date, etc.)

### Story 2.3: Feedback and Communication Tables Schema
**As a** data architect  
**I want** to create feedback and communication tracking tables  
**So that** client satisfaction and communication history is preserved

#### Acceptance Criteria
1. **Feedback table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - feedback_id (TEXT UNIQUE)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - session_id (INTEGER FOREIGN KEY → sessions.id)
   - feedback_date (DATE)
   - feedback_text (TEXT)
   - satisfaction_rating (TEXT CHECK (satisfaction_rating IN ('Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied')))
   - improvement_suggestions (TEXT)
   - follow_up_required (BOOLEAN DEFAULT FALSE)
   - feedback_photo_url (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

2. **Goals table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - goal_name (TEXT NOT NULL)
   - description (TEXT)
   - target_date (DATE)
   - progress (INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100))
   - motivational_quote (TEXT)
   - reward (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)
   - updated_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

3. Many-to-many relationship table **Goal_Sessions** for linking goals to sessions
4. Proper constraints and validation rules applied
5. Test data insertion and query functionality verified

### Story 2.4: Financial and Sales Tables Schema  
**As a** business data manager  
**I want** to create financial tracking tables  
**So that** invoicing, sales, and referral data is properly managed

#### Acceptance Criteria
1. **Invoices table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - invoice_number (TEXT UNIQUE NOT NULL)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - invoice_date (DATE)
   - due_date (DATE)
   - amount_due (DECIMAL(10,2))
   - status (TEXT CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Draft')))
   - services_provided (TEXT)
   - payment_method (TEXT CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'PayPal', 'Check')))
   - notes (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

2. **Sales table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - sale_id (TEXT UNIQUE NOT NULL)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - session_package (TEXT CHECK (session_package IN ('Single Session', '5-Session Package', '10-Session Package', 'Monthly Subscription')))
   - sale_date (DATE)
   - amount (DECIMAL(10,2))
   - salesperson (TEXT)
   - payment_method (TEXT CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'PayPal', 'Cash')))
   - follow_up_needed (BOOLEAN DEFAULT FALSE)
   - notes (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

3. **Referrals table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - referral_id (TEXT UNIQUE NOT NULL)
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - referrer_name (TEXT)
   - referred_client_name (TEXT)
   - referral_date (DATE)
   - referral_status (TEXT CHECK (referral_status IN ('Pending', 'Contacted', 'Converted', 'Not Interested')))
   - client_relationship (TEXT)
   - referral_source (TEXT CHECK (referral_source IN ('Social Media', 'Website', 'Friend/Family', 'Event', 'Other')))
   - incentive_offered (TEXT)
   - notes (TEXT)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

4. Financial calculations and reporting queries tested
5. Data validation rules prevent invalid entries

### Story 2.5: Automation and Logging Tables Schema
**As a** system administrator  
**I want** to create automation tracking and logging tables  
**So that** business process automation is properly monitored and managed

#### Acceptance Criteria
1. **Automation_Rules table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - rule_name (TEXT NOT NULL)
   - trigger_event (TEXT CHECK (trigger_event IN ('New Client Added', 'Session Scheduled', 'Feedback Received', 'Invoice Generated', 'Goal Achieved')))
   - action (TEXT CHECK (action IN ('Send Email', 'Create Task', 'Notify Coach', 'Update Progress Report', 'Generate Invoice')))
   - status (TEXT CHECK (status IN ('Active', 'Inactive', 'Paused')))
   - client_id (INTEGER FOREIGN KEY → clients.id) -- for client-specific rules
   - last_modified (DATE)
   - created_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

2. **Automation_Log table** created with fields:
   - id (INTEGER PRIMARY KEY)
   - event_type (TEXT CHECK (event_type IN ('Lead Created', 'Session Booked', 'Payment Captured', 'Email Sent', 'Calendar Updated', 'Error')))
   - client_id (INTEGER FOREIGN KEY → clients.id)
   - session_id (INTEGER FOREIGN KEY → sessions.id) 
   - details (TEXT)
   - success (BOOLEAN DEFAULT TRUE)
   - error_message (TEXT)
   - source (TEXT CHECK (source IN ('Website Form', 'Stripe Webhook', 'Calendar', 'N8N Workflow', 'Manual Entry')))
   - timestamp (DATETIME DEFAULT CURRENT_TIMESTAMP)

3. **Form_Submissions table** created for website forms:
   - id (INTEGER PRIMARY KEY)
   - name (TEXT NOT NULL)
   - email (TEXT NOT NULL)
   - message (TEXT)
   - form_type (TEXT DEFAULT 'contact')
   - processed (BOOLEAN DEFAULT FALSE)
   - client_id (INTEGER FOREIGN KEY → clients.id) -- set when converted to client
   - submitted_at (DATETIME DEFAULT CURRENT_TIMESTAMP)

4. Logging queries optimized for performance
5. Data retention policies defined

### Story 2.6: Data Migration Scripts Development
**As a** data migration specialist  
**I want** to create scripts that extract data from Airtable and load into D1  
**So that** all business data is preserved during migration

#### Acceptance Criteria
1. Node.js migration script created using Airtable API
2. Script authenticates with Airtable using API key
3. All 11 tables data extracted preserving relationships
4. Data validation and cleaning performed during migration
5. Foreign key relationships properly mapped and maintained
6. Attachment URLs converted to Cloudflare R2 if needed
7. Migration rollback procedure documented
8. Data integrity verification queries created
9. Migration can be run multiple times safely (upsert logic)
10. Progress reporting and error logging implemented

#### Implementation Details
**Migration Script Structure (migrate-airtable-to-d1.js):**
```javascript
import Airtable from 'airtable'
import { drizzle } from 'drizzle-orm/d1'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base('appXk9QepZD7Riwyl')

class AirtableD1Migrator {
  constructor(d1Database) {
    this.db = drizzle(d1Database)
    this.tableMapping = {
      'Clients': 'clients',
      'Sessions': 'sessions', 
      'Progress Reports': 'progress_reports',
      'Feedback': 'feedback',
      'Goals': 'goals',
      'Invoices': 'invoices',
      'Sales': 'sales',
      'Referrals': 'referrals',
      'Automation Rules': 'automation_rules',
      'Automation Log': 'automation_log',
      'Form Submissions': 'form_submissions'
    }
  }

  async migrateTable(airtableTableName) {
    console.log(`Migrating ${airtableTableName}...`)
    
    const records = await base(airtableTableName)
      .select({ maxRecords: 1000 })
      .all()
    
    for (const record of records) {
      await this.insertRecord(airtableTableName, record)
    }
    
    console.log(`✅ Migrated ${records.length} records from ${airtableTableName}`)
  }

  async insertRecord(tableName, airtableRecord) {
    const d1TableName = this.tableMapping[tableName]
    const transformedData = this.transformRecord(tableName, airtableRecord)
    
    // Upsert logic for idempotent migrations
    return await this.db.insert(d1TableName)
      .values(transformedData)
      .onConflictDoUpdate({
        target: ['airtable_id'],
        set: transformedData
      })
  }

  transformRecord(tableName, record) {
    // Convert Airtable record to D1 schema format
    const baseFields = {
      airtable_id: record.id,
      created_at: record.get('Created') || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    switch(tableName) {
      case 'Clients':
        return {
          ...baseFields,
          client_name: record.get('Client Name'),
          contact_details: JSON.stringify(record.get('Contact Details')),
          personal_preferences: record.get('Personal Preferences'),
          profile_photo_url: this.extractAttachmentUrl(record.get('Profile Photo')),
          schedules: record.get('Schedules'),
          zapier_log: record.get('Zapier Log')
        }
      // Add other table transformations...
    }
  }

  extractAttachmentUrl(attachments) {
    if (!attachments || !Array.isArray(attachments)) return null
    return attachments[0]?.url || null
  }
}

// Usage
export default async function migrate(env) {
  const migrator = new AirtableD1Migrator(env.DB)
  
  for (const tableName of Object.keys(migrator.tableMapping)) {
    await migrator.migrateTable(tableName)
  }
  
  console.log('🎉 Migration completed successfully')
}
```

**Migration Commands:**
```bash
# Run migration locally
npx wrangler dev --d1 DB=dan-reece-coaching-db --local --execute migrate-airtable-to-d1.js

# Run migration in production
npx wrangler dev --d1 DB=dan-reece-coaching-db --execute migrate-airtable-to-d1.js

# Verify migration
npx wrangler d1 execute dan-reece-coaching-db --command "SELECT COUNT(*) FROM clients"
```

### Story 2.7: Database Schema Validation and Testing
**As a** quality assurance engineer  
**I want** to validate the D1 database schema and relationships  
**So that** data integrity is maintained and queries perform efficiently

#### Acceptance Criteria
1. All foreign key relationships tested and working
2. Check constraints prevent invalid data entry
3. Index performance measured on large datasets
4. Complex queries (joins across multiple tables) tested
5. Database triggers created for updated_at timestamp automation
6. Schema documentation generated and reviewed
7. Performance benchmarks established
8. Connection pooling and query optimization verified
9. Data export functionality tested
10. Backup and restore procedures validated

## Technical Requirements

### Database Infrastructure
- Cloudflare D1 database with appropriate tier/limits
- Wrangler CLI for database management
- Database bindings for local and production environments
- Connection pooling and query optimization

### Migration Tools
- Node.js with Airtable API client
- Database seeding and migration scripts
- Data validation and integrity checking
- Error handling and logging

### Schema Design
- Proper normalization while maintaining query performance
- Foreign key constraints for referential integrity
- Appropriate indexes for common query patterns
- Check constraints for data validation
- Timestamp tracking for audit trails

## Dependencies
- Airtable API access token and permissions
- Cloudflare D1 database provisioning
- Wrangler CLI configuration
- Node.js development environment

## Risks and Mitigations
- **Data loss during migration**: Multiple backups and rollback procedures
- **Relationship integrity**: Thorough testing of foreign key mappings  
- **Performance issues**: Index optimization and query performance testing
- **Migration downtime**: Parallel migration with cutover strategy

## Definition of Done
- Complete D1 database schema matching Airtable structure
- All 11 tables created with proper relationships and constraints  
- Migration scripts successfully transfer all data
- Data integrity verified through comprehensive testing
- Database performance meets requirements for D1 Manager
- Migration documentation and rollback procedures complete
- Database ready for Epic 4 D1 Manager deployment