# User Story 002-6: Data Migration Scripts Development

## User Story
**As a** database administrator  
**I want** automated migration scripts to deploy and version the database schema  
**So that** I can reliably deploy database changes across environments and maintain version control


## Acceptance Criteria

1. **Migration Framework Setup**
   - Implement migration tool configuration (node-pg-migrate or Knex.js)
   - Support up and down migrations for all changes
   - Version control integration with clear naming conventions
   - Environment-specific configuration support

2. **Schema Creation Migrations**
   - Sequential migrations for each story's schema:
     - 001_create_core_tables.js (Story 2.1)
     - 002_create_session_tables.js (Story 2.2)
     - 003_create_feedback_tables.js (Story 2.3)
     - 004_create_financial_tables.js (Story 2.4)
     - 005_create_automation_tables.js (Story 2.5)

3. **Data Seeding Scripts**
   - Development environment seed data
   - Test data for QA environments
   - Production-safe default configurations
   - Reference data for lookups and enums

4. **Migration Safety Features**
   - Transaction wrapping for atomic operations
   - Validation checks before and after migrations
   - Rollback capabilities with data preservation
   - Migration lock to prevent concurrent executions

5. Migrations compatible with existing CI/CD pipeline
6. Support for multiple database environments  
7. Integration with existing backup procedures
8. Compatibility with connection pooling configuration
9. All migrations must be idempotent
10. Rollback scripts tested for each migration
11. Performance impact assessment for large tables
12. Zero-downtime deployment strategy implemented

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database migration execution
- **mcp__github__**: Version control for migration scripts
- **Node.js/Knex.js**: Migration framework
- **mcp__supabase__**: PostgreSQL migration best practices
- **mcp__ref__**: Cloudflare D1 migration documentation

### 📋 Step-by-Step Implementation

#### 1. Migration Framework Setup

```javascript
// migrations/001_create_core_tables.js
exports.up = async (pgm) => {
  // Create extensions
  pgm.createExtension('uuid-ossp', { ifNotExists: true });
  pgm.createExtension('pgcrypto', { ifNotExists: true });
  
  // Users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    email_verified: {
      type: 'boolean',
      default: false
    },
    full_name: 'varchar(255)',
    display_name: 'varchar(100)',
    avatar_url: 'text',
    phone: 'varchar(20)',
    timezone: {
      type: 'varchar(50)',
      default: 'America/New_York'
    },
    preferences: {
      type: 'jsonb',
      default: '{}'
    },
    metadata: {
      type: 'jsonb',
      default: '{}'
    },
    is_active: {
      type: 'boolean',
      default: true
    },
    last_login_at: 'timestamptz',
    created_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()')
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()')
    }
  });

  // Create indexes
  pgm.createIndex('users', 'email');
  pgm.createIndex('users', 'created_at');
  
  // Create update trigger
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('users', { cascade: true });
  pgm.sql('DROP FUNCTION IF EXISTS update_updated_at() CASCADE;');
};

// migrations/002_create_session_tables.js
exports.up = async (pgm) => {
  // Sessions table
  pgm.createTable('sessions', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    user_id: {
      type: 'uuid',
      references: 'users',
      onDelete: 'CASCADE'
    },
    session_type: 'varchar(50)',
    scheduled_at: 'timestamptz',
    duration_minutes: 'integer',
    status: {
      type: 'varchar(50)',
      default: 'scheduled'
    },
    meeting_link: 'text',
    notes: 'text',
    recordings: 'jsonb',
    created_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()')
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()')
    }
  });

  // Session notes table
  pgm.createTable('session_notes', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    session_id: {
      type: 'uuid',
      references: 'sessions',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: 'uuid',
      references: 'users'
    },
    note_type: 'varchar(50)',
    content: 'text',
    is_private: {
      type: 'boolean',
      default: false
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('NOW()')
    }
  });

  // Create indexes
  pgm.createIndex('sessions', ['user_id', 'scheduled_at']);
  pgm.createIndex('sessions', 'status');
  pgm.createIndex('session_notes', 'session_id');
};

exports.down = (pgm) => {
  pgm.dropTable('session_notes', { cascade: true });
  pgm.dropTable('sessions', { cascade: true });
};
```

#### 2. Seed Data Scripts

```javascript
// seeds/001_initial_data.js
exports.seed = async (knex) => {
  // Clear existing data
  await knex('services').del();
  
  // Insert services
  await knex('services').insert([
    {
      id: knex.raw('gen_random_uuid()'),
      name: '1:1 Executive Coaching',
      slug: '1-1-executive-coaching',
      description: 'Personalized coaching for executives and leaders',
      category: 'coaching',
      base_price: 500.00,
      currency: 'USD',
      duration_minutes: 60,
      is_active: true,
      metadata: JSON.stringify({
        features: ['Personalized feedback', 'Action planning', 'Follow-up support'],
        delivery_method: 'virtual'
      })
    },
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Group Communication Training',
      slug: 'group-communication-training',
      description: 'Team workshops for effective communication',
      category: 'training',
      base_price: 2000.00,
      currency: 'USD',
      duration_minutes: 240,
      is_active: true,
      metadata: JSON.stringify({
        max_participants: 20,
        delivery_method: 'hybrid'
      })
    },
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Discovery Call',
      slug: 'discovery-call',
      description: 'Free consultation to discuss your needs',
      category: 'consultation',
      base_price: 0.00,
      currency: 'USD',
      duration_minutes: 30,
      is_active: true,
      metadata: JSON.stringify({
        booking_link: 'https://calendly.com/daniel-reece/discovery'
      })
    }
  ]);

  // Insert pricing tiers
  await knex('pricing_tiers').insert([
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Basic Package',
      description: '4 sessions per month',
      price: 1800.00,
      billing_period: 'monthly',
      features: JSON.stringify([
        '4 x 60-minute sessions',
        'Email support',
        'Session recordings'
      ]),
      is_active: true
    },
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Professional Package',
      description: '8 sessions per month with priority support',
      price: 3400.00,
      billing_period: 'monthly',
      features: JSON.stringify([
        '8 x 60-minute sessions',
        'Priority email support',
        'Session recordings',
        'Custom exercises',
        'Progress tracking'
      ]),
      is_active: true
    },
    {
      id: knex.raw('gen_random_uuid()'),
      name: 'Enterprise Package',
      description: 'Unlimited sessions for your team',
      price: 12000.00,
      billing_period: 'monthly',
      features: JSON.stringify([
        'Unlimited sessions',
        'Dedicated account manager',
        'Custom curriculum',
        'Team workshops',
        'Quarterly business reviews'
      ]),
      is_active: true
    }
  ]);
};
```

#### 3. Migration Configuration

```javascript
// knexfile.js or migrate.config.js
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'daniel_reece_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: './migrations',
      tableName: 'migrations_history'
    },
    seeds: {
      directory: './seeds'
    }
  },
  
  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
      tableName: 'migrations_history'
    },
    ssl: { rejectUnauthorized: false }
  },
  
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
      tableName: 'migrations_history'
    },
    ssl: { rejectUnauthorized: false },
    pool: {
      min: 2,
      max: 10
    }
  }
};
```

#### 4. Utility Scripts

```bash
#!/bin/bash
# scripts/db-migrate.sh

# Migration utility script
set -e

ENVIRONMENT=${1:-development}

echo "Running migrations for $ENVIRONMENT environment..."

# Run migrations
npx knex migrate:latest --env=$ENVIRONMENT

# Show current version
npx knex migrate:currentVersion --env=$ENVIRONMENT

echo "Migrations completed successfully!"
```

```bash
#!/bin/bash
# scripts/db-rollback.sh

# Rollback utility script
set -e

ENVIRONMENT=${1:-development}
STEPS=${2:-1}

echo "Rolling back $STEPS migration(s) in $ENVIRONMENT environment..."

# Rollback migrations
npx knex migrate:rollback --env=$ENVIRONMENT

echo "Rollback completed successfully!"
```

```javascript
// scripts/validate-schema.js
const knex = require('knex');
const config = require('../knexfile');

async function validateSchema(env = 'development') {
  const db = knex(config[env]);
  
  try {
    console.log('Validating database schema...');
    
    // Check all required tables exist
    const requiredTables = [
      'users', 'sessions', 'session_notes', 'services',
      'pricing_tiers', 'invoices', 'payments', 'webhooks',
      'system_logs', 'audit_logs', 'workflows'
    ];
    
    for (const table of requiredTables) {
      const exists = await db.schema.hasTable(table);
      if (!exists) {
        throw new Error(`Required table '${table}' is missing`);
      }
      console.log(`✓ Table '${table}' exists`);
    }
    
    // Validate indexes
    const indexes = await db.raw(`
      SELECT tablename, indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    
    console.log(`✓ Found ${indexes.rows.length} indexes`);
    
    // Check row counts
    for (const table of requiredTables) {
      const result = await db(table).count('* as count');
      console.log(`  ${table}: ${result[0].count} rows`);
    }
    
    console.log('Schema validation completed successfully!');
  } catch (error) {
    console.error('Schema validation failed:', error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

validateSchema(process.argv[2]);
```

### 🔄 Integration Points

1. **CI/CD Pipeline Integration**
   - Automated migration on deployment
   - Pre-deployment validation
   - Rollback on failure

2. **Environment Management**
   - Development auto-migration
   - Staging validation
   - Production approval workflow

3. **Backup Integration**
   - Pre-migration backup
   - Point-in-time recovery
   - Disaster recovery procedures

### ✅ Testing Strategy

1. **Migration Testing**
   - Test all up migrations sequentially
   - Verify rollback for each migration
   - Test idempotency of migrations

2. **Environment Testing**
   - Development environment deployment
   - Staging environment validation
   - Production deployment simulation

3. **Data Integrity Testing**
   - Verify data preservation during migrations
   - Test seed data insertion
   - Validate foreign key constraints

### 🚨 Risk Mitigation

1. **Data Loss Prevention**
   - Risk: Data corruption during failed migration
   - Mitigation: Transaction wrapping, automated backups, tested rollbacks

2. **Deployment Risks**
   - Risk: Breaking changes in production
   - Mitigation: Staging validation, backwards compatibility checks

3. **Performance Risks**
   - Risk: Long-running migrations causing downtime
   - Mitigation: Batched migrations, off-peak deployment, read replicas

### 📊 Success Metrics

1. **Deployment Metrics**
   - Migration success rate: 100%
   - Average migration time < 30 seconds
   - Zero data loss incidents

2. **Reliability Metrics**
   - Successful rollback rate: 100%
   - Environment parity maintained
   - Schema validation passing

3. **Development Metrics**
   - Migration creation time < 1 hour
   - Automated testing coverage > 90%
   - CI/CD integration working

## Dependencies
- Story 002-1: Core database schema
- Story 002-2: Session management tables
- Story 002-3: Feedback tables
- Story 002-4: Financial tables
- Story 002-5: Automation and logging tables

## Story Points
**Estimated:** 5 points
**Actual:** [To be completed]

## Notes
This story provides automated, version-controlled database deployment with safe rollback capabilities, environment-specific configurations, and comprehensive validation tools. The migration scripts ensure consistent database state across all environments while maintaining data integrity.