# User Story 002-5: Automation and Logging Tables Schema

## User Story
**As a** system administrator  
**I want** comprehensive automation and logging tables in the database  
**So that** I can track system events, automate workflows, and maintain audit trails for compliance and debugging

## Acceptance Criteria
1. Design and implement webhook management tables for incoming/outgoing webhooks
2. Create comprehensive event logging infrastructure with structured logging
3. Implement automation workflow tables with state tracking
4. Build audit trail system for all data modifications
5. Support webhook signature verification and retry logic
6. Enable flexible metadata storage using JSONB columns
7. Implement performance metrics and monitoring tables
8. Create scheduled jobs and execution tracking
9. Support API rate limiting at database level
10. Ensure immutable audit logs for compliance

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database creation and migration management
- **mcp__github__**: Version control for schema files
- **mcp__n8n-cloud__**: Automation workflow integration
- **mcp__supabase__**: Reference for PostgreSQL best practices
- **mcp__ref__**: Cloudflare D1 documentation reference

### 📋 Step-by-Step Implementation

#### 1. Webhook Management System

1. **Webhook Management System**
   - Store incoming and outgoing webhook configurations
   - Track webhook delivery status and retry attempts
   - Support multiple webhook providers (Stripe, Airtable, Tally, etc.)
   - Implement webhook signature verification storage

2. **Event Logging Infrastructure**
   - Capture all system events with structured logging
   - Support different log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
   - Include context metadata (user_id, session_id, request_id)
   - Implement log rotation and archival strategies

3. **Automation Workflow Tables**
   - Define workflow templates and triggers
   - Track workflow execution state and history
   - Support conditional logic and branching
   - Store workflow variables and context

4. **Audit Trail System**
   - Record all data modifications with before/after states
   - Track user actions and API calls
   - Maintain compliance-ready audit logs
   - Support tamper-proof audit entries

### Integration Requirements:

5. Existing database schemas continue to function unchanged
6. New logging integrates with existing error handling patterns
7. Webhook system maintains compatibility with current API endpoints
8. Audit trails automatically capture changes from all existing tables

### Quality Requirements:

9. Logging performance impact < 5% on transaction time
10. Webhook delivery guarantees at-least-once delivery
11. Audit logs are immutable once written
12. All tables include appropriate indexes for query performance

#### Core Tables Structure:

```sql
-- Webhook Configuration and Management
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100), -- 'stripe', 'airtable', 'tally', 'custom'
    url TEXT NOT NULL,
    method VARCHAR(10) DEFAULT 'POST',
    headers JSONB,
    secret_key TEXT, -- for signature verification
    is_active BOOLEAN DEFAULT true,
    retry_config JSONB DEFAULT '{"max_attempts": 3, "backoff_seconds": [60, 300, 900]}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook Events and Delivery
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES webhooks(id),
    event_type VARCHAR(100),
    payload JSONB NOT NULL,
    signature VARCHAR(500),
    delivery_status VARCHAR(50) DEFAULT 'pending', -- pending, delivered, failed, retrying
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- System Event Logging
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    log_level VARCHAR(20) NOT NULL, -- DEBUG, INFO, WARNING, ERROR, CRITICAL
    category VARCHAR(100), -- 'api', 'webhook', 'payment', 'email', 'system'
    event_type VARCHAR(100),
    message TEXT NOT NULL,
    context JSONB, -- flexible metadata storage
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    request_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    stack_trace TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation Workflows
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50), -- 'webhook', 'schedule', 'event', 'manual'
    trigger_config JSONB,
    steps JSONB NOT NULL, -- workflow definition
    variables JSONB,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id),
    status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
    current_step INTEGER,
    context JSONB, -- execution context and variables
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    execution_time_ms INTEGER
);

-- Audit Trail
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Jobs
CREATE TABLE scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    job_type VARCHAR(100), -- 'email_reminder', 'report_generation', 'data_sync'
    schedule_expression VARCHAR(100), -- cron expression
    payload JSONB,
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    last_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Execution History
CREATE TABLE job_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES scheduled_jobs(id),
    status VARCHAR(50) NOT NULL, -- 'started', 'completed', 'failed'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    output JSONB,
    execution_time_ms INTEGER
);

-- API Rate Limiting
CREATE TABLE api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- user_id, api_key, ip_address
    endpoint VARCHAR(255),
    window_start TIMESTAMPTZ NOT NULL,
    request_count INTEGER DEFAULT 1,
    limit_exceeded BOOLEAN DEFAULT false,
    UNIQUE(identifier, endpoint, window_start)
);

-- Error Tracking
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_code VARCHAR(50),
    error_type VARCHAR(100),
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    request_id VARCHAR(100),
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_type VARCHAR(100), -- 'api_response', 'query_execution', 'job_duration'
    endpoint VARCHAR(255),
    duration_ms INTEGER,
    memory_usage_mb INTEGER,
    cpu_usage_percent DECIMAL(5,2),
    context JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_webhook_events_status ON webhook_events(delivery_status, next_retry_at);
CREATE INDEX idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_level_category ON system_logs(log_level, category);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(workflow_id, status);
CREATE INDEX idx_scheduled_jobs_next_run ON scheduled_jobs(next_run_at) WHERE is_active = true;
CREATE INDEX idx_error_logs_unresolved ON error_logs(created_at DESC) WHERE resolved = false;
CREATE INDEX idx_api_rate_limits_identifier ON api_rate_limits(identifier, window_start);

-- Partitioning for large tables (optional but recommended)
-- Partition system_logs by month
-- Partition audit_logs by month
-- Partition performance_metrics by week
```

### Views for Monitoring:

```sql
-- Active Webhooks Dashboard
CREATE VIEW v_webhook_health AS
SELECT 
    w.name,
    w.provider,
    COUNT(CASE WHEN we.delivery_status = 'delivered' THEN 1 END) as delivered_count,
    COUNT(CASE WHEN we.delivery_status = 'failed' THEN 1 END) as failed_count,
    AVG(we.attempts) as avg_attempts,
    MAX(we.created_at) as last_event
FROM webhooks w
LEFT JOIN webhook_events we ON w.id = we.webhook_id
WHERE we.created_at > NOW() - INTERVAL '24 hours'
GROUP BY w.id, w.name, w.provider;

-- System Health Overview
CREATE VIEW v_system_health AS
SELECT 
    log_level,
    category,
    COUNT(*) as count,
    DATE_TRUNC('hour', created_at) as hour
FROM system_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY log_level, category, DATE_TRUNC('hour', created_at);

-- Audit Activity Summary
CREATE VIEW v_audit_activity AS
SELECT 
    table_name,
    action,
    COUNT(*) as change_count,
    COUNT(DISTINCT user_id) as unique_users,
    DATE(created_at) as audit_date
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY table_name, action, DATE(created_at);
```

### 🔄 Integration Points

1. **Webhook Integration**
   - Stripe payment webhooks
   - Airtable form submissions
   - Tally survey responses
   - Custom API webhooks

2. **Logging Integration**
   - API request/response logging
   - Error tracking and debugging
   - Performance monitoring
   - User activity tracking

3. **Automation Workflows**
   - Email notifications
   - Data synchronization
   - Scheduled reports
   - Batch processing

### ✅ Testing Strategy

1. **Schema Validation**
   - Verify all tables created successfully
   - Test foreign key constraints
   - Validate indexes for performance

2. **Webhook Testing**
   - Test webhook delivery and retry logic
   - Verify signature validation
   - Test failure scenarios

3. **Audit Trail Testing**
   - Verify immutability of audit logs
   - Test trigger functions
   - Validate data capture completeness

### 🚨 Risk Mitigation

1. **Performance Risks**
   - Risk: Logging overhead impacting transaction performance
   - Mitigation: Asynchronous logging, proper indexing, regular archival

2. **Storage Risks**
   - Risk: Rapid growth of log and audit tables
   - Mitigation: Implement data retention policies, partitioning strategy

3. **Security Risks**
   - Risk: Sensitive data in logs
   - Mitigation: Data masking, encryption for sensitive fields

### 📊 Success Metrics

1. **Performance Metrics**
   - Logging overhead < 5% of transaction time
   - Webhook delivery success rate > 99%
   - Audit log write performance < 10ms

2. **Reliability Metrics**
   - Zero data loss in audit trails
   - 100% webhook signature verification
   - Successful retry for failed webhooks

3. **Scalability Metrics**
   - Support for 1000+ events/second
   - Efficient query performance on large datasets
   - Minimal storage growth with archival

## Dependencies
- Story 002-1: Core database schema (users, services tables)
- Story 002-2: Session management tables
- Story 002-3: Feedback and communication tables
- Story 002-4: Financial and sales tables

## Story Points
**Estimated:** 8 points
**Actual:** [To be completed]

## Notes
This schema provides the foundation for complete system observability, webhook-based integrations (Stripe, Airtable, Tally), compliance-ready audit trails, and automated workflow execution. The flexible JSONB columns allow for future extensibility without schema changes.