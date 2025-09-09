#!/bin/bash
# Database connection validation test suite

set -e  # Exit on any error

echo "🧪 Testing D1 database connection and setup..."
echo "Database: dan-reece-coaching-db"
echo "========================================="

# Set up authentication - use the working 1Password setup from the project
if [ -f ".env" ]; then
    AUTH_CMD="op run --env-file=.env -- "
else
    echo "⚠️  No .env file found, trying with existing environment..."
    AUTH_CMD=""
fi

# Test 1: Basic connection (local)
echo ""
echo "1. 🔍 Testing local database connection..."
${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT 1 as test, 'local' as environment" || {
    echo "❌ Local database connection failed"
    exit 1
}
echo "✅ Local database connection successful"

# Test 2: Basic connection (remote)
echo ""
echo "2. 🌐 Testing remote database connection..."
${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --remote --command="SELECT 1 as test, 'remote' as environment" || {
    echo "❌ Remote database connection failed"
    exit 1
}
echo "✅ Remote database connection successful"

# Test 3: DateTime functions
echo ""
echo "3. 📅 Testing DateTime functions..."
${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT datetime('now') as current_time, date('now') as current_date" || {
    echo "❌ DateTime functions test failed"
    exit 1
}
echo "✅ DateTime functions working"

# Test 4: Table creation and cleanup
echo ""
echo "4. 📋 Testing table operations..."
${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --local --command="CREATE TEMPORARY TABLE test_table (id INTEGER PRIMARY KEY, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" || {
    echo "❌ Table creation failed"
    exit 1
}
echo "✅ Table creation successful"

# Test 5: Data insertion
echo ""
echo "5. 📝 Testing data insertion..."
${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --local --command="INSERT INTO test_table (name) VALUES ('test record 1'), ('test record 2')" || {
    echo "❌ Data insertion failed"
    exit 1
}
echo "✅ Data insertion successful"

# Test 6: Data querying  
echo ""
echo "6. 🔎 Testing data querying..."
result=$(${AUTH_CMD}npx wrangler d1 execute dan-reece-coaching-db --local --command="SELECT COUNT(*) as count FROM test_table")
echo "Query result: $result"
if [[ $result == *'"count": 2'* ]]; then
    echo "✅ Data querying successful"
else
    echo "❌ Data querying failed - expected 2 records"
    exit 1
fi

# Test 7: Database management script
echo ""
echo "7. 🛠️  Testing database management script..."
node scripts/db-management.js health || {
    echo "❌ Database management script failed"
    exit 1
}
echo "✅ Database management script working"

# Test 8: List databases
echo ""
echo "8. 📋 Testing database listing..."
${AUTH_CMD}npx wrangler d1 list | grep -q "dan-reece-coaching-db" || {
    echo "❌ Database not found in list"
    exit 1
}
echo "✅ Database found in listing"

# Test 9: Test backup creation
echo ""
echo "9. 💾 Testing backup functionality..."
node scripts/backup-automation.js create schema || {
    echo "❌ Backup creation failed"
    exit 1
}
echo "✅ Backup creation successful"

echo ""
echo "🎉 ALL DATABASE TESTS PASSED!"
echo "========================================="
echo "Database: dan-reece-coaching-db"
echo "Environment: Both local and remote tested"
echo "Features validated:"
echo "  ✅ Database connection (local & remote)"
echo "  ✅ SQL query execution"
echo "  ✅ Table operations"
echo "  ✅ Data operations (INSERT/SELECT)"
echo "  ✅ DateTime functions"
echo "  ✅ Management scripts"
echo "  ✅ Database listing"
echo "  ✅ Backup functionality"
echo ""
echo "🚀 D1 Database infrastructure is ready for development!"