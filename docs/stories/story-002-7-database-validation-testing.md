# User Story 002-7: Database Schema Validation and Testing

## User Story
**As a** quality assurance engineer  
**I want** comprehensive database schema validation and testing procedures  
**So that** we can ensure data integrity, performance, and reliability across all database operations

## Acceptance Criteria
1. Create automated schema validation scripts to verify table structures
2. Implement data integrity testing for all foreign key relationships
3. Build performance testing suite for critical queries and operations
4. Create unit tests for all database functions and triggers
5. Implement integration tests for cross-table operations
6. Develop load testing scenarios for concurrent user operations
7. Create data consistency validation across environments
8. Build automated regression testing for schema changes
9. Implement security testing for SQL injection and access control
10. Create monitoring and alerting for database health metrics

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Jest/Mocha**: JavaScript testing framework
- **mcp__github__**: Version control for test scripts
- **PostgreSQL pg_tap**: Database testing extension
- **k6/Artillery**: Load testing tools
- **mcp__supabase__**: Database testing best practices
- **mcp__ref__**: Testing documentation and patterns

### 📋 Step-by-Step Implementation

#### 1. Schema Validation Tests

```javascript
// tests/schema/validation.test.js
const { Client } = require('pg');
const { expect } = require('chai');

describe('Database Schema Validation', () => {
  let client;
  
  beforeAll(async () => {
    client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    await client.connect();
  });
  
  afterAll(async () => {
    await client.end();
  });
  
  describe('Table Structure Tests', () => {
    test('should have all required tables', async () => {
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      const tables = result.rows.map(r => r.table_name);
      const requiredTables = [
        'users', 'sessions', 'session_notes', 'services',
        'pricing_tiers', 'invoices', 'payments', 'subscriptions',
        'feedback_types', 'session_feedback', 'testimonials',
        'webhooks', 'webhook_events', 'system_logs', 'audit_logs'
      ];
      
      requiredTables.forEach(table => {
        expect(tables).to.include(table);
      });
    });
    
    test('should have correct column types for users table', async () => {
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `);
      
      const columns = result.rows.reduce((acc, col) => {
        acc[col.column_name] = {
          type: col.data_type,
          nullable: col.is_nullable === 'YES'
        };
        return acc;
      }, {});
      
      expect(columns.id.type).to.equal('uuid');
      expect(columns.id.nullable).to.be.false;
      expect(columns.email.type).to.equal('character varying');
      expect(columns.email.nullable).to.be.false;
    });
  });
  
  describe('Index Validation', () => {
    test('should have performance indexes on key columns', async () => {
      const result = await client.query(`
        SELECT tablename, indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
      `);
      
      const indexes = result.rows;
      
      // Verify critical indexes exist
      const criticalIndexes = [
        { table: 'users', column: 'email' },
        { table: 'sessions', column: 'user_id' },
        { table: 'invoices', column: 'subscription_id' },
        { table: 'audit_logs', column: 'created_at' }
      ];
      
      criticalIndexes.forEach(({ table, column }) => {
        const hasIndex = indexes.some(idx => 
          idx.tablename === table && 
          idx.indexdef.includes(column)
        );
        expect(hasIndex).to.be.true;
      });
    });
  });
});
```

#### 2. Data Integrity Tests

```javascript
// tests/integrity/relationships.test.js
describe('Foreign Key Integrity Tests', () => {
  test('should enforce user deletion cascades', async () => {
    // Create test user
    const user = await client.query(`
      INSERT INTO users (email, full_name) 
      VALUES ('test@example.com', 'Test User')
      RETURNING id
    `);
    const userId = user.rows[0].id;
    
    // Create related records
    await client.query(`
      INSERT INTO sessions (user_id, session_type) 
      VALUES ($1, 'coaching')
    `, [userId]);
    
    // Delete user and verify cascade
    await client.query('DELETE FROM users WHERE id = $1', [userId]);
    
    const sessions = await client.query(
      'SELECT * FROM sessions WHERE user_id = $1',
      [userId]
    );
    
    expect(sessions.rows).to.have.length(0);
  });
  
  test('should prevent invalid foreign key references', async () => {
    const invalidUserId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    
    await expect(
      client.query(`
        INSERT INTO sessions (user_id, session_type) 
        VALUES ($1, 'coaching')
      `, [invalidUserId])
    ).to.be.rejected;
  });
  
  test('should maintain referential integrity for payments', async () => {
    // Test that invoice cannot be deleted if payment exists
    const invoice = await createTestInvoice();
    await createTestPayment(invoice.id);
    
    await expect(
      client.query('DELETE FROM invoices WHERE id = $1', [invoice.id])
    ).to.be.rejected;
  });
});
```

#### 3. Performance Testing Suite

```javascript
// tests/performance/load.test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.1'],    // Error rate under 10%
  },
};

export default function () {
  // Test user creation
  const createUserRes = http.post(
    'http://localhost:3000/api/users',
    JSON.stringify({
      email: `test${Date.now()}@example.com`,
      full_name: 'Load Test User'
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(createUserRes, {
    'user created': (r) => r.status === 201,
    'response time OK': (r) => r.timings.duration < 500,
  });
  
  // Test session queries
  const sessionsRes = http.get('http://localhost:3000/api/sessions');
  check(sessionsRes, {
    'sessions retrieved': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 300,
  });
  
  sleep(1);
}
```

#### 4. Query Performance Tests

```javascript
// tests/performance/queries.test.js
describe('Query Performance Tests', () => {
  test('dashboard query should execute under 100ms', async () => {
    const start = Date.now();
    
    await client.query(`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT s.id) as total_sessions,
        AVG(sf.rating_value) as avg_rating,
        SUM(p.amount) as total_revenue
      FROM users u
      LEFT JOIN sessions s ON u.id = s.user_id
      LEFT JOIN session_feedback sf ON s.id = sf.session_id
      LEFT JOIN payments p ON p.status = 'completed'
      WHERE u.created_at > NOW() - INTERVAL '30 days'
    `);
    
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(100);
  });
  
  test('complex aggregation should use indexes', async () => {
    const explainResult = await client.query(`
      EXPLAIN (FORMAT JSON) 
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as session_count,
        AVG(duration_minutes) as avg_duration
      FROM sessions
      WHERE created_at > NOW() - INTERVAL '1 year'
      GROUP BY DATE_TRUNC('month', created_at)
    `);
    
    const plan = explainResult.rows[0]['QUERY PLAN'][0].Plan;
    
    // Verify index scan is used
    const hasIndexScan = JSON.stringify(plan).includes('Index Scan');
    expect(hasIndexScan).to.be.true;
  });
});
```

#### 5. Security Testing

```javascript
// tests/security/injection.test.js
describe('SQL Injection Prevention Tests', () => {
  test('should prevent SQL injection in user input', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    // This should be safely parameterized
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [maliciousInput]
    );
    
    // Table should still exist
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);
    
    expect(tableExists.rows[0].exists).to.be.true;
  });
  
  test('should enforce row-level security', async () => {
    // Create two users
    const user1 = await createTestUser('user1@test.com');
    const user2 = await createTestUser('user2@test.com');
    
    // Create session for user1
    const session = await createTestSession(user1.id);
    
    // User2 should not be able to access user1's session
    const unauthorizedAccess = await attemptAccess(user2.id, session.id);
    expect(unauthorizedAccess).to.be.null;
  });
});
```

#### 6. Data Consistency Validation

```javascript
// tests/consistency/validation.test.js
describe('Data Consistency Tests', () => {
  test('should maintain accurate financial totals', async () => {
    // Sum of payment amounts should match invoice totals
    const result = await client.query(`
      WITH invoice_totals AS (
        SELECT 
          invoice_id,
          SUM(amount) as paid_amount
        FROM payments
        WHERE status = 'completed'
        GROUP BY invoice_id
      )
      SELECT 
        i.id,
        i.total_amount,
        COALESCE(it.paid_amount, 0) as paid_amount,
        i.status
      FROM invoices i
      LEFT JOIN invoice_totals it ON i.id = it.invoice_id
      WHERE i.status = 'paid' 
        AND i.total_amount != COALESCE(it.paid_amount, 0)
    `);
    
    expect(result.rows).to.have.length(0);
  });
  
  test('should have valid timestamps', async () => {
    // Updated_at should always be >= created_at
    const tables = ['users', 'sessions', 'invoices'];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT COUNT(*) as invalid_count
        FROM ${table}
        WHERE updated_at < created_at
      `);
      
      expect(result.rows[0].invalid_count).to.equal('0');
    }
  });
});
```

### 🔄 Integration Points

1. **CI/CD Integration**
   - Run tests on every commit
   - Block deployments on test failure
   - Generate test coverage reports

2. **Monitoring Integration**
   - Alert on test failures
   - Track performance metrics
   - Monitor query execution times

3. **Documentation Integration**
   - Generate test documentation
   - Update schema diagrams
   - Maintain test coverage reports

### ✅ Testing Strategy

1. **Unit Testing**
   - Test individual functions and triggers
   - Validate constraints and defaults
   - Check data type conversions

2. **Integration Testing**
   - Test multi-table operations
   - Validate transaction rollbacks
   - Check cascade operations

3. **Performance Testing**
   - Load test critical endpoints
   - Measure query performance
   - Test concurrent operations

### 🚨 Risk Mitigation

1. **Test Data Management**
   - Risk: Test data polluting production
   - Mitigation: Separate test database, cleanup procedures

2. **Performance Impact**
   - Risk: Tests affecting production performance
   - Mitigation: Run tests on dedicated instances, off-peak hours

3. **False Positives**
   - Risk: Flaky tests causing unnecessary failures
   - Mitigation: Retry logic, stable test data, proper isolation

### 📊 Success Metrics

1. **Coverage Metrics**
   - Schema coverage: 100%
   - Query coverage: > 90%
   - Edge case coverage: > 80%

2. **Performance Metrics**
   - Test execution time < 5 minutes
   - Critical query response < 100ms
   - Load test success rate > 99%

3. **Quality Metrics**
   - Zero critical bugs in production
   - Test reliability > 99%
   - Automated test adoption: 100%

## Dependencies
- Story 002-1 through 002-6: All database schemas and migrations
- Testing frameworks and tools setup
- CI/CD pipeline configuration

## Story Points
**Estimated:** 8 points
**Actual:** [To be completed]

## Notes
This comprehensive testing suite ensures database reliability, performance, and security. It provides automated validation for all schema changes, maintains data integrity, and enables confident deployments with minimal risk.