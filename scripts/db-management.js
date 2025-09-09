#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'

class D1Manager {
  constructor(dbName = 'dan-reece-coaching-db') {
    this.dbName = dbName
    this.isProduction = process.env.NODE_ENV === 'production'
    this.localFlag = this.isProduction ? '--remote' : '--local'
    this.authPrefix = 'source ~/.config/mcp/.env && op run --env-file=.env -- '
  }

  // Execute SQL command
  execute(sql) {
    const cmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.localFlag} --command="${sql}"`
    console.log(`Executing: ${cmd.replace(this.authPrefix, '[AUTH] ')}`)
    return execSync(cmd, { encoding: 'utf8' })
  }

  // Execute SQL file
  executeFile(filepath) {
    const cmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.localFlag} --file=${filepath}`
    console.log(`Executing file: ${cmd.replace(this.authPrefix, '[AUTH] ')}`)
    return execSync(cmd, { encoding: 'utf8' })
  }

  // Backup database
  backup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${this.dbName}-${timestamp}.sql`
    
    console.log(`Creating backup: ${filename}`)
    console.log('Note: D1 backup functionality coming soon. Currently storing schema and data separately.')
    
    // For now, create a simple backup of table structure
    try {
      const tables = this.execute("SELECT name FROM sqlite_master WHERE type='table'")
      writeFileSync(filename, `-- Backup created: ${new Date().toISOString()}\n-- Database: ${this.dbName}\n\n${tables}`)
      console.log(`✅ Database metadata backed up to: ${filename}`)
    } catch (error) {
      console.error('❌ Backup failed:', error.message)
    }
    
    return filename
  }

  // Show database info
  info() {
    try {
      console.log('📊 Database Information:')
      console.log('Name:', this.dbName)
      console.log('Environment:', this.isProduction ? 'Production' : 'Local')
      
      const tables = this.execute("SELECT name FROM sqlite_master WHERE type='table'")
      console.log('Tables query result:', tables)
      
      const dbInfo = this.execute("SELECT 'Database operational' as status, datetime('now') as timestamp")
      console.log('Status:', dbInfo)
    } catch (error) {
      console.error('❌ Failed to get database info:', error.message)
    }
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

  // List all databases
  listDatabases() {
    try {
      const cmd = `${this.authPrefix}npx wrangler d1 list`
      console.log('📋 Listing all D1 databases:')
      const result = execSync(cmd, { encoding: 'utf8' })
      console.log(result)
      return result
    } catch (error) {
      console.error('❌ Failed to list databases:', error.message)
      return null
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
    case 'list':
      manager.listDatabases()
      break
    case 'execute':
      if (process.argv[3]) {
        manager.execute(process.argv[3])
      } else {
        console.log('Usage: node db-management.js execute "SQL COMMAND"')
      }
      break
    default:
      console.log('Usage: node db-management.js [backup|info|health|list|execute "SQL"]')
      console.log('')
      console.log('Examples:')
      console.log('  node scripts/db-management.js health')
      console.log('  node scripts/db-management.js info')
      console.log('  node scripts/db-management.js list')
      console.log('  node scripts/db-management.js execute "SELECT 1"')
  }
}

export { D1Manager }