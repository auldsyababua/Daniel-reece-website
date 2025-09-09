// Database monitoring and performance tracking for D1
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
    
    // Store in a monitoring table (will be created in schema setup)
    try {
      await this.db.prepare(`
        INSERT OR IGNORE INTO query_log (query_preview, duration_ms, success, timestamp)
        VALUES (?1, ?2, ?3, ?4)
      `).bind(logEntry.query, logEntry.duration_ms, logEntry.success, logEntry.timestamp).run()
    } catch (error) {
      // Silently fail if monitoring table doesn't exist yet
      console.warn('Query logging failed:', error.message)
    }
  }

  async getPerformanceStats() {
    try {
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
    } catch (error) {
      console.warn('Performance stats unavailable:', error.message)
      return []
    }
  }

  async getDatabaseHealth() {
    const startTime = Date.now()
    
    try {
      // Test basic connectivity
      const connectionTest = await this.db.prepare("SELECT 1 as test").first()
      const connectionTime = Date.now() - startTime

      // Test table access (when tables exist)
      let tableCount = 0
      try {
        const tablesResult = await this.db.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").first()
        tableCount = tablesResult.count
      } catch (error) {
        // Non-critical if this fails
      }

      // Log this health check
      await this.logQuery("SELECT 1 as test", connectionTime, true)

      return {
        status: 'healthy',
        connection_time_ms: connectionTime,
        table_count: tableCount,
        timestamp: new Date().toISOString(),
        database_available: true
      }
    } catch (error) {
      // Log the failed health check
      await this.logQuery("SELECT 1 as test", Date.now() - startTime, false)
      
      return {
        status: 'error',
        connection_time_ms: Date.now() - startTime,
        error: error.message,
        timestamp: new Date().toISOString(),
        database_available: false
      }
    }
  }
}

// Wrapper for timing database operations
export class TimedQuery {
  constructor(db, monitor) {
    this.db = db
    this.monitor = monitor
  }

  async execute(query, bindings = []) {
    const startTime = Date.now()
    let success = true
    let result = null

    try {
      const stmt = this.db.prepare(query)
      if (bindings.length > 0) {
        result = await stmt.bind(...bindings).run()
      } else {
        result = await stmt.run()
      }
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - startTime
      if (this.monitor) {
        await this.monitor.logQuery(query, duration, success)
      }
    }

    return result
  }

  async first(query, bindings = []) {
    const startTime = Date.now()
    let success = true
    let result = null

    try {
      const stmt = this.db.prepare(query)
      if (bindings.length > 0) {
        result = await stmt.bind(...bindings).first()
      } else {
        result = await stmt.first()
      }
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - startTime
      if (this.monitor) {
        await this.monitor.logQuery(query, duration, success)
      }
    }

    return result
  }

  async all(query, bindings = []) {
    const startTime = Date.now()
    let success = true
    let result = null

    try {
      const stmt = this.db.prepare(query)
      if (bindings.length > 0) {
        result = await stmt.bind(...bindings).all()
      } else {
        result = await stmt.all()
      }
    } catch (error) {
      success = false
      throw error
    } finally {
      const duration = Date.now() - startTime
      if (this.monitor) {
        await this.monitor.logQuery(query, duration, success)
      }
    }

    return result
  }
}

// Helper to create monitoring tables
export async function initializeMonitoring(db) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS query_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_preview TEXT,
        duration_ms INTEGER,
        success BOOLEAN DEFAULT TRUE,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_query_log_timestamp ON query_log(timestamp)
    `).run()

    await db.prepare(`
      CREATE INDEX IF NOT EXISTS idx_query_log_duration ON query_log(duration_ms)
    `).run()

    console.log('✅ Monitoring tables initialized')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize monitoring:', error.message)
    return false
  }
}