-- Contact Form Submissions Table
-- D1 Database Schema for Executive Speech Coaching NYC

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Required fields
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Optional fields
    phone TEXT,
    company TEXT,
    role TEXT,
    timeline TEXT,
    
    -- Metadata
    submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    
    -- Status tracking
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
    notes TEXT,
    follow_up_date TEXT,
    
    -- Timestamps
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Update trigger for updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_contact_submissions_timestamp 
    AFTER UPDATE ON contact_submissions
    FOR EACH ROW
BEGIN
    UPDATE contact_submissions 
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;