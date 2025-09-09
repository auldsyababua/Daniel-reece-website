# User Story 002-1: D1 Database Creation and Configuration

## User Story
**As a** developer  
**I want** to create and configure a Cloudflare D1 database  
**So that** we have the infrastructure ready for data migration

## Acceptance Criteria
1. ✅ Cloudflare D1 database created with name "dan-reece-coaching-db"
2. ✅ Database binding configured for local development
3. ✅ Wrangler CLI configured for database management
4. ✅ Database connection verified from both local and Cloudflare environments
5. ✅ Backup and restore procedures documented
6. ✅ Database limits and quotas understood and documented
7. ✅ Access controls and API tokens configured

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database creation and management
- **mcp__github__**: Configuration tracking and documentation
- **Cloudflare Dashboard**: Database monitoring
- **mcp__supabase__**: Reference for database best practices (similar patterns)

### 📋 Step-by-Step Implementation

#### 1. D1 Database Creation
```bash
# Authenticate with Cloudflare
wrangler auth login

# Create the D1 database
npx wrangler d1 create dan-reece-coaching-db

# Expected output:
# ✅ Successfully created DB 'dan-reece-coaching-db' in region ENAM
# Created your new D1 database.
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "dan-reece-coaching-db" 
# database_id = "your-database-id-here"
```

#### 2. Wrangler Configuration Setup
**Update `wrangler.toml`:**
```toml
name = "dan-reece-site"
compatibility_date = "2024-01-01"
main = "src/index.js"

# D1 Database Configuration
[[d1_databases]]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-database-id-from-create-command"
migrations_dir = "migrations"

# Development settings
[env.development]
[[env.development.d1_databases]]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-database-id-from-create-command"

# Production settings  
[env.production]
[[env.production.d1_databases]]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-database-id-from-create-command"
```

#### 3. Local Development Setup
```bash
# Create migrations directory
mkdir -p migrations

# Generate TypeScript types for D1 binding
npx wrangler types

# Test local database connection
npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT 1 as test"

# Start development server with D1 binding
npx wrangler dev --local --port 8787
```

#### 4. Database Connection Testing
**Create test Worker (`src/database-test.js`):**
```javascript
export default {
  async fetch(request, env, ctx) {
    try {
      // Test basic connection
      const result = await env.DB.prepare("SELECT 1 as test, datetime('now') as timestamp").first()
      
      // Test prepare statement
      const stmt = env.DB.prepare("SELECT ?1 as message")
      const testQuery = await stmt.bind("Database connection successful!").first()
      
      // Test batch operations  
      const batch = [
        env.DB.prepare("SELECT 'batch1' as test"),
        env.DB.prepare("SELECT 'batch2' as test"),
        env.DB.prepare("SELECT 'batch3' as test")
      ]
      const batchResults = await env.DB.batch(batch)
      
      return Response.json({
        status: "success",
        connection: result,
        preparedStatement: testQuery,
        batchResults: batchResults.map(r => r.results).flat(),
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      return Response.json({
        status: "error", 
        message: error.message,
        stack: error.stack
      }, { status: 500 })
    }
  }
}
```

### 🎯 Database Limits and Quotas
**D1 Free Tier Limits:**
```yaml
Database Limits:
  Databases per account: 10
  Database size: 5GB
  Reads per day: 25,000,000
  Writes per day: 100,000
  Storage per database: 5GB
  Query size limit: 1MB
  Query duration: 30 seconds
  Batch size: 1000 statements
  
Production Considerations:
  # For coaching business scale:
  Expected clients: ~500
  Expected sessions: ~2000/year  
  Expected data size: <100MB
  Expected reads: <10,000/day
  Expected writes: <1,000/day
  # Well within free tier limits
```

#### 5. Database Management Scripts
**Create `scripts/db-management.js`:**
```javascript
#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

class D1Manager {
  constructor(dbName = 'dan-reece-coaching-db') {
    this.dbName = dbName
    this.isProduction = process.env.NODE_ENV === 'production'
    this.localFlag = this.isProduction ? '' : '--local'
  }

  // Execute SQL command
  execute(sql) {
    const cmd = `npx wrangler d1 execute ${this.dbName} ${this.localFlag} --command="${sql}"`
    console.log(`Executing: ${cmd}`)
    return execSync(cmd, { encoding: 'utf8' })
  }

  // Execute SQL file
  executeFile(filepath) {
    const cmd = `npx wrangler d1 execute ${this.dbName} ${this.localFlag} --file=${filepath}`
    console.log(`Executing file: ${cmd}`)
    return execSync(cmd, { encoding: 'utf8' })
  }

  // Backup database
  backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${this.dbName}-${timestamp}.sql`
    
    const cmd = `npx wrangler d1 export ${this.dbName} ${this.localFlag} --output=${filename}`
    execSync(cmd)
    console.log(`✅ Database backed up to: ${filename}`)
    return filename
  }

  // Show database info
  info() {
    const tables = this.execute("SELECT name FROM sqlite_master WHERE type='table'")
    const dbSize = this.execute("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()")
    
    console.log('📊 Database Information:')
    console.log('Tables:', tables)
    console.log('Database Size:', dbSize)
  }

  // Health check
  healthCheck() {
    try {
      const result = this.execute("SELECT datetime('now') as timestamp, 'healthy' as status")
      console.log('✅ Database health check passed:', result)
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error.message)
      return false
    }
  }
}

// CLI Usage
if (process.argv[2]) {
  const manager = new D1Manager()
  const command = process.argv[2]
  
  switch(command) {
    case 'backup':
      manager.backup()
      break
    case 'info':  
      manager.info()
      break
    case 'health':
      manager.healthCheck()
      break
    case 'execute':
      manager.execute(process.argv[3])
      break
    default:
      console.log('Usage: node db-management.js [backup|info|health|execute "SQL"]')
  }
}

export { D1Manager }
```

### 📊 Monitoring and Alerting Setup
**Database monitoring using Cloudflare Analytics:**
```javascript
// src/monitoring.js - Database metrics collection
export class D1Monitor {
  constructor(db) {
    this.db = db
  }

  async logQuery(query, duration, success = true) {
    const logEntry = {
      query: query.substring(0, 100), // First 100 chars
      duration_ms: duration,
      success,
      timestamp: new Date().toISOString()
    }
    
    // Store in a monitoring table
    await this.db.prepare(`
      INSERT INTO query_log (query_preview, duration_ms, success, timestamp)
      VALUES (?1, ?2, ?3, ?4)
    `).bind(logEntry.query, logEntry.duration_ms, logEntry.success, logEntry.timestamp).run()
  }

  async getPerformanceStats() {
    return await this.db.prepare(`
      SELECT 
        AVG(duration_ms) as avg_duration,
        MAX(duration_ms) as max_duration,
        COUNT(*) as total_queries,
        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_queries,
        DATE(timestamp) as date
      FROM query_log 
      WHERE timestamp > datetime('now', '-7 days')
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `).all()
  }
}
```

### 🔒 Security and Access Control
**Database access patterns:**
```yaml
Access Control Strategy:
  Local Development:
    - Full access via wrangler CLI
    - Local D1 instance for development
    - No production data access
    
  Production Environment:
    - Read/Write access only through Workers
    - No direct database access
    - All queries logged and monitored
    
  Admin Access:
    - D1 Manager interface (Epic 004)
    - Audit trail for all operations
    - Role-based permissions
```

### 🧪 Testing and Validation
**Database connection tests:**
```bash
#!/bin/bash
# tests/db-connection-test.sh

echo "Testing D1 database connection..."

# Test 1: Basic connection
echo "1. Testing basic connection..."
npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT 1 as test" || exit 1

# Test 2: DateTime functions
echo "2. Testing DateTime functions..."
npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT datetime('now') as current_time" || exit 1

# Test 3: Table creation
echo "3. Testing table creation..."
npx wrangler d1 execute dan-reece-coaching-db --local --command="CREATE TEMPORARY TABLE test_table (id INTEGER PRIMARY KEY, name TEXT)" || exit 1

# Test 4: Data insertion
echo "4. Testing data insertion..."
npx wrangler d1 execute dan-reece-coaching-db --local --command="INSERT INTO test_table (name) VALUES ('test')" || exit 1

# Test 5: Data querying  
echo "5. Testing data querying..."
result=$(npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT COUNT(*) as count FROM test_table")
echo "Result: $result"

echo "✅ All database connection tests passed!"
```

### 📋 Backup and Recovery Procedures
**Automated backup strategy:**
```javascript
// scripts/backup-automation.js
export class D1Backup {
  constructor(dbName) {
    this.dbName = dbName
  }

  async createBackup(type = 'full') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backups/${type}-backup-${timestamp}.sql`
    
    const cmd = type === 'schema' 
      ? `npx wrangler d1 export ${this.dbName} --output=${filename} --no-data`
      : `npx wrangler d1 export ${this.dbName} --output=${filename}`
      
    execSync(cmd)
    console.log(`✅ ${type} backup created: ${filename}`)
    
    // Upload to R2 for long-term storage
    await this.uploadToR2(filename)
    
    return filename
  }

  async restoreFromBackup(backupFile) {
    console.log(`Restoring from backup: ${backupFile}`)
    const cmd = `npx wrangler d1 execute ${this.dbName} --file=${backupFile}`
    execSync(cmd)
    console.log(`✅ Database restored from: ${backupFile}`)
  }

  // Schedule automated backups
  scheduleBackups() {
    // Daily schema backup at 2 AM
    cron.schedule('0 2 * * *', () => {
      this.createBackup('schema')
    })

    // Weekly full backup on Sunday at 3 AM  
    cron.schedule('0 3 * * 0', () => {
      this.createBackup('full')
    })
  }
}
```

### 📈 Performance Optimization
**Query optimization preparation:**
```sql
-- Performance monitoring queries
CREATE TABLE IF NOT EXISTS query_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query_preview TEXT,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance monitoring
CREATE INDEX idx_query_log_timestamp ON query_log(timestamp);
CREATE INDEX idx_query_log_duration ON query_log(duration_ms);
```

### 🔗 Integration with MCP Tools
**Using available MCP tools:**
```bash
# Monitor database operations using GitHub MCP
mcp__github__create_issue --title "D1 Database Setup Complete" --body "Database infrastructure ready for data migration"

# Track database configuration in repository
mcp__github__create_file --path "config/database.md" --content "Database configuration documentation"
```

### ✅ Success Validation Checklist
- [ ] D1 database created and accessible
- [ ] Wrangler.toml configured correctly
- [ ] Local development environment working
- [ ] Production environment accessible
- [ ] Connection tests pass in both environments
- [ ] Backup procedures tested and documented
- [ ] Database limits and quotas documented
- [ ] Monitoring and logging infrastructure ready
- [ ] Security access patterns documented
- [ ] Migration scripts directory prepared

### 📝 Next Steps Integration
- Database infrastructure ready for Epic 002-2 schema creation
- Migration directory prepared for Epic 002-6 data migration
- Monitoring foundation ready for Epic 004 D1 Manager
- Backup procedures established for production deployment