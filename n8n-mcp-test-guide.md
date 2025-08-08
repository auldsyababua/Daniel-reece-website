# n8n MCP Test Guide

## Configuration Summary

✅ **n8n MCP Server Added to Claude Desktop**
- Server name: `n8n`
- Package: `n8n-mcp` (version 2.10.3)
- Configuration: `/Users/colinaulds/Library/Application Support/Claude/claude_desktop_config.json`

## Connection Details

- **n8n Instance**: https://n8n-rrrs.sliplane.app
- **API Key**: Configured in Claude Desktop config
- **Status**: ✅ API connection verified
- **Existing Workflows**: 1 workflow found (Contact Form to Airtable + Gmail)

## Testing the MCP Connection

After restarting Claude Desktop, you should have access to these n8n MCP tools:

### Available Tools (22 total)

1. **Documentation Tools**:
   - `get_node_essentials` - Get essential node properties with examples
   - `search_nodes` - Full-text search across node documentation
   - `search_node_properties` - Find specific properties within nodes
   - `list_ai_tools` - List all AI-capable nodes

2. **Workflow Management Tools** (requires API credentials):
   - `n8n_create_workflow` - Create new workflows
   - `n8n_get_workflows` - List existing workflows
   - `n8n_get_workflow` - Get specific workflow details
   - `n8n_update_workflow` - Update workflows
   - `n8n_delete_workflow` - Delete workflows
   - `n8n_activate_workflow` - Activate/deactivate workflows

3. **Execution Tools**:
   - `n8n_execute_workflow` - Execute workflows manually
   - `n8n_get_executions` - Get workflow execution history

## Test Commands

To verify the MCP connection is working:

```
1. Restart Claude Desktop application
2. Open a new conversation
3. Try: "List available n8n workflows"
4. Try: "Get details for workflow sulvECZ4oiGc73Eg"
5. Try: "Search for webhook nodes in n8n"
```

## Next Steps

With n8n MCP configured, you can now:
- Create complex workflows directly from Claude conversations
- Get real-time help with n8n node configurations
- Manage existing workflows programmatically
- Search through n8n documentation efficiently
- Get AI-powered suggestions for workflow optimization

## Troubleshooting

If MCP tools aren't available:
1. Ensure Claude Desktop was fully restarted after config changes
2. Check the config.json file for syntax errors
3. Verify n8n-mcp package is globally installed: `npm list -g n8n-mcp`
4. Test API connectivity: `curl -H "X-N8N-API-KEY: [key]" https://n8n-rrrs.sliplane.app/api/v1/workflows`