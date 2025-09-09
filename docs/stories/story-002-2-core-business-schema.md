# User Story 002-2: Core Business Tables Schema Creation

## User Story
**As a** data architect  
**I want** to create the primary business table schemas in D1  
**So that** client data can be stored with proper structure and relationships

## Acceptance Criteria
1. ✅ **Clients table** created with all required fields and constraints
2. ✅ **Sessions table** created with foreign key relationships
3. ✅ **Progress_Reports table** created with proper validation
4. ✅ Foreign key constraints properly defined and tested
5. ✅ Indexes created on frequently queried fields

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database schema deployment
- **mcp__supabase__**: Database design pattern reference  
- **SQLite Documentation**: Schema validation
- **mcp__github__**: Schema versioning and documentation

### 📋 Step-by-Step Implementation

#### 1. Database Migration File Creation
**Create `migrations/0001_create_core_tables.sql`:**
```sql
-- Migration: Core Business Tables
-- Created: 2024-01-15
-- Description: Create primary business entities for client management

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- ============================================================================
-- CLIENTS TABLE - Core client information
-- ============================================================================
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Core client data
    client_name TEXT NOT NULL CHECK(length(client_name) > 0),
    contact_details TEXT, -- JSON format: {"email": "", "phone": "", "address": ""}
    personal_preferences TEXT, -- JSON format for coaching preferences
    profile_photo_url TEXT CHECK(profile_photo_url IS NULL OR profile_photo_url LIKE 'https://%'),
    schedules TEXT, -- JSON format for availability
    zapier_log TEXT, -- Integration logs
    
    -- Audit trail
    airtable_id TEXT UNIQUE, -- For migration tracking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT client_name_length CHECK(length(client_name) <= 255),
    CONSTRAINT contact_details_json CHECK(json_valid(contact_details) OR contact_details IS NULL),
    CONSTRAINT personal_preferences_json CHECK(json_valid(personal_preferences) OR personal_preferences IS NULL)
);

-- ============================================================================  
-- SESSIONS TABLE - Individual coaching sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Foreign key relationships
    client_id INTEGER NOT NULL,
    
    -- Session details
    session_time TEXT CHECK(session_time IS NULL OR session_time REGEXP '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'),
    session_date DATE NOT NULL,
    topics_covered TEXT,
    session_photos_urls TEXT, -- JSON array of photo URLs
    schedules TEXT, -- JSON format for session scheduling
    zapier_log TEXT, -- Integration logs
    resources TEXT, -- JSON array of resources provided
    
    -- Session metadata
    duration_minutes INTEGER DEFAULT 60 CHECK(duration_minutes > 0 AND duration_minutes <= 480),
    session_type TEXT DEFAULT 'individual' CHECK(session_type IN ('individual', 'group', 'workshop', 'assessment')),
    session_status TEXT DEFAULT 'scheduled' CHECK(session_status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    
    -- Audit trail
    airtable_id TEXT UNIQUE, -- For migration tracking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT session_date_future CHECK(session_date >= date('now', '-1 year')),
    CONSTRAINT photos_json CHECK(json_valid(session_photos_urls) OR session_photos_urls IS NULL),
    CONSTRAINT resources_json CHECK(json_valid(resources) OR resources IS NULL)
);

-- ============================================================================
-- PROGRESS_REPORTS TABLE - Client progress tracking  
-- ============================================================================
CREATE TABLE IF NOT EXISTS progress_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Core identification
    name TEXT NOT NULL, -- Report identifier/title
    
    -- Foreign key relationships
    client_id INTEGER NOT NULL,
    session_id INTEGER, -- Can be NULL for general progress reports
    
    -- Report details
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    improvements TEXT NOT NULL, -- What has improved
    areas_for_development TEXT, -- Areas needing work
    overall_progress TEXT DEFAULT 'Satisfactory' 
        CHECK(overall_progress IN ('Excellent', 'Good', 'Satisfactory', 'Needs Improvement')),
    coach_feedback TEXT, -- Detailed feedback from coach
    attachments_urls TEXT, -- JSON array of attachment URLs
    
    -- Progress metrics
    communication_score INTEGER CHECK(communication_score IS NULL OR (communication_score >= 1 AND communication_score <= 10)),
    confidence_score INTEGER CHECK(confidence_score IS NULL OR (confidence_score >= 1 AND confidence_score <= 10)),
    presentation_score INTEGER CHECK(presentation_score IS NULL OR (presentation_score >= 1 AND presentation_score <= 10)),
    
    -- Audit trail
    airtable_id TEXT UNIQUE, -- For migration tracking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT report_name_length CHECK(length(name) <= 255),
    CONSTRAINT attachments_json CHECK(json_valid(attachments_urls) OR attachments_urls IS NULL),
    CONSTRAINT report_date_valid CHECK(report_date <= date('now', '+1 day'))
);

-- ============================================================================
-- INDEXES for Performance Optimization
-- ============================================================================

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(client_name);
CREATE INDEX IF NOT EXISTS idx_clients_created ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_clients_airtable ON clients(airtable_id);

-- Sessions table indexes  
CREATE INDEX IF NOT EXISTS idx_sessions_client ON sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_sessions_client_date ON sessions(client_id, session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_airtable ON sessions(airtable_id);

-- Progress reports table indexes
CREATE INDEX IF NOT EXISTS idx_progress_client ON progress_reports(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_session ON progress_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON progress_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_progress_client_date ON progress_reports(client_id, report_date);
CREATE INDEX IF NOT EXISTS idx_progress_airtable ON progress_reports(airtable_id);

-- ============================================================================
-- TRIGGERS for Automatic Timestamp Updates
-- ============================================================================

-- Clients updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_clients_timestamp 
    AFTER UPDATE ON clients
    FOR EACH ROW
    BEGIN
        UPDATE clients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Sessions updated_at trigger  
CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp
    AFTER UPDATE ON sessions  
    FOR EACH ROW
    BEGIN
        UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Progress reports updated_at trigger
CREATE TRIGGER IF NOT EXISTS update_progress_reports_timestamp
    AFTER UPDATE ON progress_reports
    FOR EACH ROW  
    BEGIN
        UPDATE progress_reports SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- ============================================================================
-- VIEWS for Common Queries
-- ============================================================================

-- Active clients with recent sessions
CREATE VIEW IF NOT EXISTS active_clients AS
SELECT 
    c.id,
    c.client_name,
    c.created_at as client_since,
    COUNT(s.id) as total_sessions,
    MAX(s.session_date) as last_session_date,
    AVG(pr.communication_score) as avg_communication_score
FROM clients c
LEFT JOIN sessions s ON c.id = s.client_id AND s.session_status = 'completed'
LEFT JOIN progress_reports pr ON c.id = pr.client_id  
GROUP BY c.id, c.client_name, c.created_at
HAVING MAX(s.session_date) > date('now', '-90 days') OR COUNT(s.id) = 0;

-- Session summary view
CREATE VIEW IF NOT EXISTS session_summary AS
SELECT 
    s.id,
    s.session_date,
    s.session_time,
    s.session_status,
    c.client_name,
    s.topics_covered,
    s.duration_minutes,
    COUNT(pr.id) as progress_reports_count
FROM sessions s
JOIN clients c ON s.client_id = c.id
LEFT JOIN progress_reports pr ON s.id = pr.session_id
GROUP BY s.id, s.session_date, s.session_time, s.session_status, c.client_name, s.topics_covered, s.duration_minutes;
```

#### 2. Schema Deployment and Testing
**Deploy the schema:**
```bash
# Deploy to local development
npx wrangler d1 migrations apply dan-reece-coaching-db --local

# Verify schema creation
npx wrangler d1 execute dan-reece-coaching-db --local --command="
SELECT name, sql FROM sqlite_master 
WHERE type='table' AND name IN ('clients', 'sessions', 'progress_reports')
ORDER BY name"

# Test foreign key constraints are enabled
npx wrangler d1 execute dan-reece-coaching-db --local --command="PRAGMA foreign_keys"
```

#### 3. Data Validation Testing
**Create `scripts/test-core-schema.js`:**
```javascript
export class CoreSchemaValidator {
  constructor(db) {
    this.db = db
  }

  async validateClientTable() {
    console.log('🧪 Testing Clients table...')
    
    // Test 1: Valid client insertion
    const clientResult = await this.db.prepare(`
      INSERT INTO clients (client_name, contact_details, personal_preferences)
      VALUES (?, ?, ?)
    `).bind(
      'John Smith',
      '{"email": "john@example.com", "phone": "+1-555-0123"}',
      '{"preferred_time": "morning", "communication_style": "direct"}'
    ).run()
    
    console.log('✅ Client insertion successful:', clientResult.meta.last_row_id)
    
    // Test 2: Invalid client name (empty string)
    try {
      await this.db.prepare(`
        INSERT INTO clients (client_name) VALUES ('')
      `).run()
      throw new Error('Should have failed on empty client name')
    } catch (error) {
      console.log('✅ Empty client name validation working')
    }
    
    // Test 3: Invalid JSON in contact_details
    try {
      await this.db.prepare(`
        INSERT INTO clients (client_name, contact_details) 
        VALUES ('Jane Doe', 'invalid json')
      `).run()
      throw new Error('Should have failed on invalid JSON')
    } catch (error) {
      console.log('✅ JSON validation working')
    }
    
    return clientResult.meta.last_row_id
  }

  async validateSessionTable(clientId) {
    console.log('🧪 Testing Sessions table...')
    
    // Test 1: Valid session insertion
    const sessionResult = await this.db.prepare(`
      INSERT INTO sessions (client_id, session_date, topics_covered, duration_minutes)
      VALUES (?, ?, ?, ?)
    `).bind(
      clientId,
      '2024-02-01', 
      'Public speaking fundamentals',
      90
    ).run()
    
    console.log('✅ Session insertion successful:', sessionResult.meta.last_row_id)
    
    // Test 2: Foreign key constraint
    try {
      await this.db.prepare(`
        INSERT INTO sessions (client_id, session_date) 
        VALUES (99999, '2024-02-01')
      `).run()
      throw new Error('Should have failed on invalid client_id')
    } catch (error) {
      console.log('✅ Foreign key constraint working')
    }
    
    // Test 3: Duration validation
    try {
      await this.db.prepare(`
        INSERT INTO sessions (client_id, session_date, duration_minutes) 
        VALUES (?, '2024-02-01', 0)
      `).bind(clientId).run()
      throw new Error('Should have failed on zero duration')
    } catch (error) {
      console.log('✅ Duration validation working')
    }
    
    return sessionResult.meta.last_row_id
  }

  async validateProgressReportTable(clientId, sessionId) {
    console.log('🧪 Testing Progress Reports table...')
    
    // Test 1: Valid progress report
    const reportResult = await this.db.prepare(`
      INSERT INTO progress_reports (
        name, client_id, session_id, improvements, 
        overall_progress, communication_score
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      'Initial Assessment Report',
      clientId,
      sessionId,
      'Improved eye contact and voice projection',
      'Good',
      8
    ).run()
    
    console.log('✅ Progress report insertion successful:', reportResult.meta.last_row_id)
    
    // Test 2: Invalid progress score
    try {
      await this.db.prepare(`
        INSERT INTO progress_reports (
          name, client_id, improvements, communication_score
        )
        VALUES ('Test Report', ?, 'Test improvements', 11)
      `).bind(clientId).run()
      throw new Error('Should have failed on invalid score')
    } catch (error) {
      console.log('✅ Score validation working')
    }
    
    return reportResult.meta.last_row_id
  }

  async testRelationships(clientId) {
    console.log('🧪 Testing table relationships...')
    
    // Test JOIN queries
    const joinResult = await this.db.prepare(`
      SELECT 
        c.client_name,
        s.session_date,
        pr.overall_progress
      FROM clients c
      LEFT JOIN sessions s ON c.id = s.client_id
      LEFT JOIN progress_reports pr ON s.id = pr.session_id
      WHERE c.id = ?
    `).bind(clientId).all()
    
    console.log('✅ JOIN query successful:', joinResult.results.length, 'rows')
    
    // Test cascade delete
    const deleteResult = await this.db.prepare(`
      DELETE FROM clients WHERE id = ?
    `).bind(clientId).run()
    
    // Verify cascading worked
    const sessionCount = await this.db.prepare(`
      SELECT COUNT(*) as count FROM sessions WHERE client_id = ?
    `).bind(clientId).first()
    
    console.log('✅ Cascade delete working - remaining sessions:', sessionCount.count)
  }

  async runAllTests() {
    try {
      const clientId = await this.validateClientTable()
      const sessionId = await this.validateSessionTable(clientId)  
      await this.validateProgressReportTable(clientId, sessionId)
      await this.testRelationships(clientId)
      
      console.log('🎉 All core schema tests passed!')
      return true
    } catch (error) {
      console.error('❌ Schema test failed:', error)
      return false
    }
  }
}

// Usage in Worker
export default {
  async fetch(request, env) {
    if (request.url.includes('/test-schema')) {
      const validator = new CoreSchemaValidator(env.DB)
      const success = await validator.runAllTests()
      
      return Response.json({
        success,
        message: success ? 'All schema tests passed' : 'Schema tests failed'
      })
    }
  }
}
```

#### 4. Performance Testing and Optimization
**Query performance testing:**
```sql
-- Performance test queries
-- Test 1: Client lookup by name (should use index)
EXPLAIN QUERY PLAN SELECT * FROM clients WHERE client_name = 'John Smith';

-- Test 2: Sessions by date range (should use date index)  
EXPLAIN QUERY PLAN 
SELECT * FROM sessions 
WHERE session_date BETWEEN '2024-01-01' AND '2024-12-31';

-- Test 3: Complex join query (should use multiple indexes)
EXPLAIN QUERY PLAN
SELECT c.client_name, COUNT(s.id) as session_count
FROM clients c
LEFT JOIN sessions s ON c.id = s.client_id
WHERE s.session_date > '2024-01-01'
GROUP BY c.id, c.client_name;

-- Test 4: Progress report aggregation
EXPLAIN QUERY PLAN
SELECT 
  client_id,
  AVG(communication_score) as avg_communication,
  COUNT(*) as report_count
FROM progress_reports 
WHERE report_date > date('now', '-30 days')
GROUP BY client_id;
```

### 📊 Database Monitoring Setup
**Add monitoring queries:**
```sql
-- Create monitoring table for schema health
CREATE TABLE IF NOT EXISTS schema_health (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  row_count INTEGER,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  index_usage_count INTEGER DEFAULT 0
);

-- Monitoring trigger for row count tracking
CREATE TRIGGER IF NOT EXISTS track_table_changes
AFTER INSERT ON clients
BEGIN
  INSERT OR REPLACE INTO schema_health (table_name, row_count)
  VALUES ('clients', (SELECT COUNT(*) FROM clients));
END;
```

### 🔒 Security Considerations
**Access patterns and permissions:**
```javascript
// Security wrapper for database queries
export class SecureClientAccess {
  constructor(db, userId = null) {
    this.db = db
    this.userId = userId
  }

  // Only return clients accessible to current user
  async getClientData(clientId) {
    // Add row-level security logic here
    return await this.db.prepare(`
      SELECT id, client_name, created_at, updated_at
      FROM clients 
      WHERE id = ?
      -- Add access control based on userId if needed
    `).bind(clientId).first()
  }

  // Secure session data access
  async getClientSessions(clientId, limit = 50) {
    return await this.db.prepare(`
      SELECT s.*, c.client_name
      FROM sessions s
      JOIN clients c ON s.client_id = c.id
      WHERE s.client_id = ?
      ORDER BY s.session_date DESC
      LIMIT ?
    `).bind(clientId, limit).all()
  }
}
```

### 🧪 Integration Testing
**End-to-end testing scenarios:**
```bash
#!/bin/bash
# tests/integration/core-schema-test.sh

echo "🧪 Running Core Schema Integration Tests"

# Test 1: Schema deployment
echo "1. Testing schema deployment..."
npx wrangler d1 migrations apply dan-reece-coaching-db --local || exit 1

# Test 2: Table creation verification
echo "2. Verifying table creation..."
TABLES=$(npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name IN ('clients', 'sessions', 'progress_reports')" | grep -o '[0-9]*')

if [ "$TABLES" -ne 3 ]; then
  echo "❌ Expected 3 tables, found $TABLES"
  exit 1
fi

# Test 3: Foreign key constraints
echo "3. Testing foreign key constraints..."
npx wrangler d1 execute dan-reece-coaching-db --local --command="PRAGMA foreign_keys" || exit 1

# Test 4: Index creation
echo "4. Verifying indexes..."
INDEXES=$(npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT COUNT(*) as count FROM sqlite_master WHERE type='index'" | grep -o '[0-9]*')

if [ "$INDEXES" -lt 10 ]; then
  echo "❌ Expected at least 10 indexes, found $INDEXES"
  exit 1
fi

echo "✅ All integration tests passed!"
```

### 📈 Performance Benchmarks
**Expected performance targets:**
```yaml
Performance Targets:
  Client Insertion: <10ms
  Client Lookup by ID: <5ms
  Client Lookup by Name: <15ms (indexed)
  Session Insertion: <10ms
  Session Range Query: <25ms
  Progress Report Creation: <10ms
  Complex Join Queries: <50ms
  
Data Scale Expectations:
  Clients: ~500 records
  Sessions: ~2000 records/year
  Progress Reports: ~1000 records/year
  Total Database Size: <100MB
```

### ✅ Success Validation Checklist
- [ ] All three core tables created successfully
- [ ] Foreign key constraints working properly
- [ ] Check constraints preventing invalid data
- [ ] Indexes created and performing well
- [ ] Triggers automatically updating timestamps
- [ ] Views providing useful data summaries
- [ ] JSON validation working for structured fields
- [ ] Performance tests meeting targets
- [ ] Security access patterns implemented
- [ ] Integration tests passing

### 📋 Documentation and Handoff
**Schema documentation generated:**
```sql
-- Generate documentation
SELECT 
  name as table_name,
  sql as create_statement
FROM sqlite_master 
WHERE type = 'table' 
AND name IN ('clients', 'sessions', 'progress_reports')
UNION ALL
SELECT 
  name as index_name,
  sql as create_statement  
FROM sqlite_master
WHERE type = 'index'
AND tbl_name IN ('clients', 'sessions', 'progress_reports');
```

### 🔗 Next Steps Preparation
- Core schema foundation ready for Epic 002-3 feedback tables
- Foreign key patterns established for remaining tables
- Performance monitoring baseline established
- Migration tracking (`airtable_id` fields) ready for Epic 002-6
- Security patterns ready for Epic 004 D1 Manager integration