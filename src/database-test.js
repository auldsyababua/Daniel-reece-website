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
        timestamp: new Date().toISOString(),
        database_info: {
          name: "dan-reece-coaching-db",
          binding: "DB",
          environment: env.ENVIRONMENT || "development"
        }
      })
      
    } catch (error) {
      return Response.json({
        status: "error", 
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  }
}