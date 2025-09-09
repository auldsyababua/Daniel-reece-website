#!/usr/bin/env node

import { execSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export class D1Backup {
  constructor(dbName = 'dan-reece-coaching-db') {
    this.dbName = dbName
    this.isProduction = process.env.NODE_ENV === 'production'
    this.authPrefix = 'source ~/.config/mcp/.env && op run --env-file=.env -- '
    this.backupDir = 'backups'
    
    // Ensure backup directory exists
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true })
    }
  }

  async createBackup(type = 'full') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = join(this.backupDir, `${type}-backup-${this.dbName}-${timestamp}.sql`)
    
    console.log(`Creating ${type} backup: ${filename}`)
    
    try {
      // Get table structure
      const schemaCmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.isProduction ? '--remote' : '--local'} --command="SELECT sql FROM sqlite_master WHERE type='table'"`
      const schemaResult = execSync(schemaCmd, { encoding: 'utf8' })
      
      // Get all table names
      const tablesCmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.isProduction ? '--remote' : '--local'} --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"`
      const tablesResult = execSync(tablesCmd, { encoding: 'utf8' })
      
      let backupContent = `-- Backup created: ${new Date().toISOString()}\n`
      backupContent += `-- Database: ${this.dbName}\n`
      backupContent += `-- Type: ${type}\n`
      backupContent += `-- Environment: ${this.isProduction ? 'Production' : 'Local'}\n\n`
      
      // Add schema
      backupContent += `-- SCHEMA\n${schemaResult}\n\n`
      
      if (type === 'full') {
        // For full backup, add data from all tables
        try {
          const tables = this.parseTableNames(tablesResult)
          for (const table of tables) {
            console.log(`Backing up table: ${table}`)
            const dataCmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.isProduction ? '--remote' : '--local'} --command="SELECT * FROM ${table}"`
            const dataResult = execSync(dataCmd, { encoding: 'utf8' })
            backupContent += `-- DATA for table: ${table}\n${dataResult}\n\n`
          }
        } catch (error) {
          console.warn('Warning: Could not backup all table data:', error.message)
          backupContent += `-- Warning: Data backup incomplete due to: ${error.message}\n`
        }
      }
      
      writeFileSync(filename, backupContent)
      console.log(`✅ ${type} backup created: ${filename}`)
      
      // TODO: Upload to R2 for long-term storage when R2 is configured
      
      return filename
    } catch (error) {
      console.error(`❌ Backup failed:`, error.message)
      throw error
    }
  }

  parseTableNames(tablesResult) {
    try {
      const parsed = JSON.parse(tablesResult)
      if (parsed[0] && parsed[0].results) {
        return parsed[0].results.map(row => row.name)
      }
      return []
    } catch (error) {
      console.warn('Could not parse table names, returning empty list')
      return []
    }
  }

  async restoreFromBackup(backupFile) {
    if (!existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`)
    }

    console.log(`Restoring from backup: ${backupFile}`)
    
    try {
      const cmd = `${this.authPrefix}npx wrangler d1 execute ${this.dbName} ${this.isProduction ? '--remote' : '--local'} --file=${backupFile}`
      const result = execSync(cmd, { encoding: 'utf8' })
      console.log(`✅ Database restored from: ${backupFile}`)
      console.log('Result:', result)
      return true
    } catch (error) {
      console.error(`❌ Restore failed:`, error.message)
      throw error
    }
  }

  // List available backups
  listBackups() {
    if (!existsSync(this.backupDir)) {
      console.log('No backups directory found')
      return []
    }

    const { readdirSync, statSync } = require('fs')
    const backups = readdirSync(this.backupDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const fullPath = join(this.backupDir, file)
        const stats = statSync(fullPath)
        return {
          filename: file,
          path: fullPath,
          size: stats.size,
          created: stats.mtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created))

    console.log('📋 Available backups:')
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.filename} (${(backup.size / 1024).toFixed(1)} KB) - ${backup.created}`)
    })

    return backups
  }

  // Clean old backups (keep last N backups)
  cleanupBackups(keepCount = 10) {
    const backups = this.listBackups()
    if (backups.length <= keepCount) {
      console.log(`Only ${backups.length} backups found, no cleanup needed`)
      return
    }

    const { unlinkSync } = require('fs')
    const toDelete = backups.slice(keepCount)
    
    console.log(`Cleaning up ${toDelete.length} old backups...`)
    toDelete.forEach(backup => {
      try {
        unlinkSync(backup.path)
        console.log(`Deleted: ${backup.filename}`)
      } catch (error) {
        console.error(`Failed to delete ${backup.filename}:`, error.message)
      }
    })
    
    console.log(`✅ Cleanup completed, kept ${keepCount} most recent backups`)
  }

  // Schedule automated backups (placeholder for future cron integration)
  scheduleBackups() {
    console.log('📅 Backup scheduling not implemented yet.')
    console.log('For now, run backups manually:')
    console.log('  node scripts/backup-automation.js create full')
    console.log('  node scripts/backup-automation.js create schema')
    
    // TODO: Implement with node-cron when needed
    // Daily schema backup at 2 AM
    // cron.schedule('0 2 * * *', () => {
    //   this.createBackup('schema')
    // })

    // Weekly full backup on Sunday at 3 AM  
    // cron.schedule('0 3 * * 0', () => {
    //   this.createBackup('full')
    // })
  }
}

// CLI Usage
if (process.argv[2]) {
  const backup = new D1Backup()
  const command = process.argv[2]
  
  switch(command) {
    case 'create':
      const type = process.argv[3] || 'full'
      backup.createBackup(type).catch(console.error)
      break
    case 'list':  
      backup.listBackups()
      break
    case 'restore':
      const backupFile = process.argv[3]
      if (backupFile) {
        backup.restoreFromBackup(backupFile).catch(console.error)
      } else {
        console.log('Usage: node backup-automation.js restore <backup-file>')
      }
      break
    case 'cleanup':
      const keepCount = parseInt(process.argv[3]) || 10
      backup.cleanupBackups(keepCount)
      break
    case 'schedule':
      backup.scheduleBackups()
      break
    default:
      console.log('Usage: node backup-automation.js [create|list|restore|cleanup|schedule]')
      console.log('')
      console.log('Examples:')
      console.log('  node scripts/backup-automation.js create full')
      console.log('  node scripts/backup-automation.js create schema')
      console.log('  node scripts/backup-automation.js list')
      console.log('  node scripts/backup-automation.js restore backups/full-backup-dan-reece-coaching-db-2024-01-01.sql')
      console.log('  node scripts/backup-automation.js cleanup 5')
  }
}

export { D1Backup }