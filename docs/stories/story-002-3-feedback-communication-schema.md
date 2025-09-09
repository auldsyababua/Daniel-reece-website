# User Story 002-3: Feedback and Communication Tables Schema

## User Story
**As a** data architect  
**I want** to create comprehensive feedback and communication tracking tables in D1 database  
**So that** client satisfaction insights and communication history are preserved for better coaching relationships

## Acceptance Criteria
1. Design and implement feedback collection tables supporting multiple feedback types (session feedback, NPS scores, testimonials)
2. Create communication tracking tables for all client interactions (emails, notes, follow-ups)
3. Implement proper foreign key relationships with core business tables (clients, sessions)
4. Support rating scales (1-10 numeric, 5-star ratings, NPS -100 to 100)
5. Enable time-series tracking for feedback trends and communication history
6. Include metadata fields for sentiment analysis and categorization
7. Implement audit trails for all feedback modifications
8. Support multimedia attachments for communication records
9. Enable aggregation queries for average ratings and feedback analytics
10. Ensure GDPR compliance with data retention and deletion capabilities

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database creation and migration management
- **mcp__github__**: Version control for schema files
- **mcp__n8n-cloud__**: Automation workflow integration for feedback notifications
- **mcp__airtable__**: Data migration from existing feedback records
- **mcp__ref__**: Cloudflare D1 documentation reference
- **mcp__exasearch__**: Best practices research for feedback systems

### 📋 Step-by-Step Implementation

#### 1. Create Feedback Tables Schema

```sql
-- feedback_types table: Define different feedback categories
CREATE TABLE feedback_types (
    feedback_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_name TEXT NOT NULL UNIQUE,
    description TEXT,
    scale_type TEXT CHECK(scale_type IN ('numeric', 'star', 'nps', 'text_only')),
    min_value INTEGER,
    max_value INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- session_feedback table: Feedback for individual coaching sessions
CREATE TABLE session_feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    feedback_type_id INTEGER NOT NULL,
    rating_value INTEGER,
    feedback_text TEXT,
    strengths TEXT,
    areas_for_improvement TEXT,
    action_items TEXT,
    is_public BOOLEAN DEFAULT 0,
    sentiment_score REAL, -- For ML sentiment analysis (-1 to 1)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES coaching_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (feedback_type_id) REFERENCES feedback_types(feedback_type_id)
);

-- Create index for performance
CREATE INDEX idx_session_feedback_client ON session_feedback(client_id);
CREATE INDEX idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_created ON session_feedback(created_at);

-- nps_scores table: Net Promoter Score tracking
CREATE TABLE nps_scores (
    nps_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    score INTEGER NOT NULL CHECK(score >= 0 AND score <= 10),
    category TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN score >= 9 THEN 'promoter'
            WHEN score >= 7 THEN 'passive'
            ELSE 'detractor'
        END
    ) STORED,
    reason TEXT,
    follow_up_required BOOLEAN DEFAULT 0,
    follow_up_completed BOOLEAN DEFAULT 0,
    survey_date DATE DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- testimonials table: Client testimonials and reviews
CREATE TABLE testimonials (
    testimonial_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    headline TEXT,
    content TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT 0,
    is_published BOOLEAN DEFAULT 0,
    published_date DATE,
    permission_to_use BOOLEAN DEFAULT 0,
    use_full_name BOOLEAN DEFAULT 0,
    company_mention_allowed BOOLEAN DEFAULT 0,
    video_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);
```

#### 2. Create Communication Tracking Tables

```sql
-- communication_channels table: Define communication methods
CREATE TABLE communication_channels (
    channel_id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_name TEXT NOT NULL UNIQUE,
    channel_type TEXT CHECK(channel_type IN ('email', 'phone', 'video', 'in_person', 'slack', 'other')),
    is_active BOOLEAN DEFAULT 1
);

-- client_communications table: Track all client interactions
CREATE TABLE client_communications (
    communication_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    direction TEXT CHECK(direction IN ('inbound', 'outbound')) NOT NULL,
    subject TEXT,
    content TEXT,
    summary TEXT, -- AI-generated summary for long communications
    communication_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INTEGER, -- For calls/meetings
    follow_up_required BOOLEAN DEFAULT 0,
    follow_up_date DATE,
    tags TEXT, -- JSON array of tags
    sentiment TEXT CHECK(sentiment IN ('positive', 'neutral', 'negative', 'mixed')),
    created_by TEXT, -- Staff member who logged this
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES communication_channels(channel_id)
);

-- Create indexes for query performance
CREATE INDEX idx_client_comm_client ON client_communications(client_id);
CREATE INDEX idx_client_comm_date ON client_communications(communication_date);
CREATE INDEX idx_client_comm_follow_up ON client_communications(follow_up_required, follow_up_date);

-- communication_attachments table: Store references to attached files
CREATE TABLE communication_attachments (
    attachment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    communication_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    storage_url TEXT NOT NULL, -- Cloudflare R2 URL
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (communication_id) REFERENCES client_communications(communication_id) ON DELETE CASCADE
);

-- internal_notes table: Private notes about clients
CREATE TABLE internal_notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    note_type TEXT CHECK(note_type IN ('observation', 'strategy', 'concern', 'success', 'general')),
    content TEXT NOT NULL,
    is_confidential BOOLEAN DEFAULT 0,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);
```

#### 3. Create Feedback Analytics Views

```sql
-- View for client feedback summary
CREATE VIEW client_feedback_summary AS
SELECT 
    c.client_id,
    c.first_name || ' ' || c.last_name as client_name,
    COUNT(DISTINCT sf.feedback_id) as total_feedback_count,
    AVG(sf.rating_value) as avg_session_rating,
    MAX(sf.created_at) as last_feedback_date,
    AVG(n.score) as avg_nps_score,
    COUNT(DISTINCT t.testimonial_id) as testimonial_count
FROM clients c
LEFT JOIN session_feedback sf ON c.client_id = sf.client_id
LEFT JOIN nps_scores n ON c.client_id = n.client_id
LEFT JOIN testimonials t ON c.client_id = t.client_id AND t.is_published = 1
GROUP BY c.client_id;

-- View for feedback trends over time
CREATE VIEW feedback_trends AS
SELECT 
    DATE(created_at) as feedback_date,
    COUNT(*) as feedback_count,
    AVG(rating_value) as avg_rating,
    COUNT(CASE WHEN rating_value >= 4 THEN 1 END) as positive_count,
    COUNT(CASE WHEN rating_value < 3 THEN 1 END) as negative_count
FROM session_feedback
GROUP BY DATE(created_at)
ORDER BY feedback_date DESC;

-- View for NPS calculation
CREATE VIEW nps_calculation AS
SELECT 
    survey_date,
    COUNT(*) as total_responses,
    SUM(CASE WHEN category = 'promoter' THEN 1 ELSE 0 END) as promoters,
    SUM(CASE WHEN category = 'detractor' THEN 1 ELSE 0 END) as detractors,
    ROUND(
        (CAST(SUM(CASE WHEN category = 'promoter' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100) -
        (CAST(SUM(CASE WHEN category = 'detractor' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100), 
        1
    ) as nps_score
FROM nps_scores
GROUP BY survey_date
ORDER BY survey_date DESC;
```

#### 4. Create Audit and History Tables

```sql
-- feedback_audit_log table: Track all changes to feedback
CREATE TABLE feedback_audit_log (
    audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    action TEXT CHECK(action IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
    old_values TEXT, -- JSON of previous values
    new_values TEXT, -- JSON of new values
    changed_by TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    change_reason TEXT
);

-- Create trigger for feedback audit trail
CREATE TRIGGER feedback_audit_update
AFTER UPDATE ON session_feedback
BEGIN
    INSERT INTO feedback_audit_log (table_name, record_id, action, old_values, new_values)
    VALUES (
        'session_feedback',
        NEW.feedback_id,
        'UPDATE',
        json_object(
            'rating_value', OLD.rating_value,
            'feedback_text', OLD.feedback_text,
            'updated_at', OLD.updated_at
        ),
        json_object(
            'rating_value', NEW.rating_value,
            'feedback_text', NEW.feedback_text,
            'updated_at', NEW.updated_at
        )
    );
END;
```

#### 5. Worker Function for Feedback Processing

```typescript
// workers/feedback-handler.ts
import { Env } from './types';

export interface FeedbackRequest {
  sessionId: number;
  clientId: number;
  rating: number;
  feedback: string;
  strengths?: string;
  improvements?: string;
}

export async function handleFeedbackSubmission(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const feedback: FeedbackRequest = await request.json();
    
    // Validate input
    if (!feedback.sessionId || !feedback.clientId || !feedback.rating) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert feedback using D1 binding
    const result = await env.DB.prepare(`
      INSERT INTO session_feedback (
        session_id, client_id, feedback_type_id, 
        rating_value, feedback_text, strengths, 
        areas_for_improvement
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      feedback.sessionId,
      feedback.clientId,
      1, // Default feedback type
      feedback.rating,
      feedback.feedback,
      feedback.strengths || null,
      feedback.improvements || null
    ).run();

    // Calculate sentiment score (simplified)
    const sentimentScore = calculateSentiment(feedback.feedback);
    
    // Update with sentiment
    if (sentimentScore !== null) {
      await env.DB.prepare(`
        UPDATE session_feedback 
        SET sentiment_score = ? 
        WHERE feedback_id = ?
      `).bind(sentimentScore, result.meta.last_row_id).run();
    }

    // Trigger n8n workflow for follow-up if rating is low
    if (feedback.rating < 3) {
      await triggerLowScoreWorkflow(feedback, env);
    }

    return new Response(JSON.stringify({ 
      success: true,
      feedbackId: result.meta.last_row_id,
      message: 'Feedback recorded successfully'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process feedback' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function calculateSentiment(text: string): number | null {
  if (!text) return null;
  
  // Simplified sentiment calculation
  // In production, integrate with AI service
  const positiveWords = ['excellent', 'great', 'amazing', 'helpful', 'valuable'];
  const negativeWords = ['poor', 'bad', 'terrible', 'unhelpful', 'waste'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.2;
    if (negativeWords.includes(word)) score -= 0.2;
  });
  
  return Math.max(-1, Math.min(1, score));
}

async function triggerLowScoreWorkflow(
  feedback: FeedbackRequest, 
  env: Env
): Promise<void> {
  // Trigger n8n webhook for low score follow-up
  const webhookUrl = env.N8N_WEBHOOK_URL + '/feedback-alert';
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: feedback.clientId,
      sessionId: feedback.sessionId,
      rating: feedback.rating,
      feedback: feedback.feedback,
      timestamp: new Date().toISOString()
    })
  });
}
```

### 🎯 Testing and Validation

```sql
-- Test data insertion script
INSERT INTO feedback_types (type_name, description, scale_type, min_value, max_value)
VALUES 
  ('Session Rating', 'Post-session feedback rating', 'numeric', 1, 10),
  ('NPS Survey', 'Net Promoter Score survey', 'nps', 0, 10),
  ('Testimonial', 'Client testimonial and review', 'star', 1, 5);

INSERT INTO communication_channels (channel_name, channel_type)
VALUES 
  ('Email', 'email'),
  ('Phone Call', 'phone'),
  ('Zoom Meeting', 'video'),
  ('In-Person', 'in_person'),
  ('Slack', 'slack');

-- Validation queries
-- Check foreign key constraints
SELECT 
  'session_feedback' as table_name,
  COUNT(*) as orphaned_records
FROM session_feedback sf
LEFT JOIN clients c ON sf.client_id = c.client_id
WHERE c.client_id IS NULL

UNION ALL

SELECT 
  'client_communications' as table_name,
  COUNT(*) as orphaned_records
FROM client_communications cc
LEFT JOIN clients c ON cc.client_id = c.client_id
WHERE c.client_id IS NULL;

-- Test aggregate functions
SELECT 
  AVG(rating_value) as avg_rating,
  MIN(rating_value) as min_rating,
  MAX(rating_value) as max_rating,
  COUNT(*) as total_feedback
FROM session_feedback
WHERE created_at >= date('now', '-30 days');
```

### 📊 Performance Monitoring

```typescript
// Monitor query performance
export async function monitorFeedbackPerformance(env: Env) {
  const metrics = {
    avgQueryTime: 0,
    totalQueries: 0,
    slowQueries: []
  };

  // Test critical queries
  const queries = [
    {
      name: 'Client Feedback Summary',
      sql: 'SELECT * FROM client_feedback_summary WHERE client_id = ?',
      params: [1]
    },
    {
      name: 'Recent Feedback',
      sql: `SELECT * FROM session_feedback 
            WHERE created_at >= datetime('now', '-7 days') 
            ORDER BY created_at DESC LIMIT 20`,
      params: []
    },
    {
      name: 'NPS Calculation',
      sql: 'SELECT * FROM nps_calculation LIMIT 10',
      params: []
    }
  ];

  for (const query of queries) {
    const start = Date.now();
    await env.DB.prepare(query.sql).bind(...query.params).all();
    const duration = Date.now() - start;
    
    metrics.avgQueryTime += duration;
    metrics.totalQueries++;
    
    if (duration > 100) { // Log slow queries (>100ms)
      metrics.slowQueries.push({
        name: query.name,
        duration,
        sql: query.sql
      });
    }
  }

  metrics.avgQueryTime = metrics.avgQueryTime / metrics.totalQueries;
  
  // Log to analytics or monitoring service
  console.log('Feedback Performance Metrics:', metrics);
  
  return metrics;
}
```

### 🔒 Security Considerations

```typescript
// Input validation and sanitization
export function validateFeedbackInput(input: any): boolean {
  // Rating validation
  if (typeof input.rating !== 'number' || 
      input.rating < 1 || 
      input.rating > 10) {
    return false;
  }
  
  // Text length validation
  if (input.feedback && input.feedback.length > 5000) {
    return false;
  }
  
  // SQL injection prevention (using parameterized queries)
  // XSS prevention for display
  if (input.feedback) {
    input.feedback = sanitizeHtml(input.feedback);
  }
  
  return true;
}

function sanitizeHtml(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// GDPR compliance - data deletion
export async function deleteClientFeedbackData(
  clientId: number, 
  env: Env
): Promise<void> {
  const tables = [
    'session_feedback',
    'nps_scores', 
    'testimonials',
    'client_communications',
    'internal_notes'
  ];
  
  for (const table of tables) {
    await env.DB.prepare(
      `DELETE FROM ${table} WHERE client_id = ?`
    ).bind(clientId).run();
  }
  
  // Log the deletion for compliance
  await env.DB.prepare(`
    INSERT INTO feedback_audit_log 
    (table_name, record_id, action, changed_by, change_reason)
    VALUES ('all_feedback_tables', ?, 'DELETE', 'GDPR_REQUEST', 'Client data deletion request')
  `).bind(clientId).run();
}
```

### ✅ Success Validation Checklist

- [ ] All tables created successfully with proper constraints
- [ ] Foreign key relationships enforced and working
- [ ] Indexes created for optimal query performance
- [ ] Views return expected aggregated data
- [ ] Audit triggers capture all modifications
- [ ] Worker functions handle feedback submission
- [ ] Validation queries return no orphaned records
- [ ] Performance metrics meet requirements (<100ms for most queries)
- [ ] Security measures implemented (input validation, sanitization)
- [ ] GDPR compliance functions tested

### 🔗 Next Steps Integration

1. **Story 2.4**: Build upon these tables to create financial tracking schemas
2. **Story 3.2**: Integrate feedback forms with frontend components
3. **Story 3.4**: Connect n8n workflows to feedback triggers
4. **Story 4.3**: Configure D1 Manager for feedback data management
5. **Story 5.3**: Optimize feedback queries for performance

## Migration Script from Airtable

```javascript
// migration/migrate-feedback-data.js
import { config } from 'dotenv';
config();

export async function migrateFeedbackData(env) {
  const airtableBase = env.AIRTABLE_BASE_ID;
  const airtableApiKey = env.AIRTABLE_API_KEY;
  
  // Fetch feedback from Airtable
  const feedbackResponse = await fetch(
    `https://api.airtable.com/v0/${airtableBase}/Feedback`,
    {
      headers: {
        'Authorization': `Bearer ${airtableApiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const feedbackData = await feedbackResponse.json();
  
  // Transform and insert into D1
  for (const record of feedbackData.records) {
    const fields = record.fields;
    
    await env.DB.prepare(`
      INSERT INTO session_feedback (
        client_id, session_id, rating_value, 
        feedback_text, created_at
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(
      fields['Client ID'],
      fields['Session ID'],
      fields['Rating'],
      fields['Feedback'],
      fields['Created']
    ).run();
  }
  
  console.log(`Migrated ${feedbackData.records.length} feedback records`);
}
```

## Resources and References

- [Cloudflare D1 Foreign Keys Documentation](https://developers.cloudflare.com/d1/sql-api/foreign-keys/)
- [D1 Query Best Practices](https://developers.cloudflare.com/d1/best-practices/query-d1/)
- [Database Schema Design Best Practices](https://www.bytebase.com/blog/top-database-schema-design-best-practices/)
- [Customer Review System Design](https://www.geeksforgeeks.org/how-to-design-a-relational-database-for-customer-reviews-and-ratings-platform/)