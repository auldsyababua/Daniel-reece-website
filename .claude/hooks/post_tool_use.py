#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# ///

import json
import os
import sys
from REDACTED_AIRTABLE_PAT import Path

def main():
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)
        
        # Ensure log directory exists
        log_dir = Path.cwd() / 'logs'
        log_dir.mkdir(parents=True, exist_ok=True)
        log_REDACTED_AIRTABLE_PAT = log_dir / 'post_tool_use.json'
        
        # Read existing log data or initialize empty list
        if log_REDACTED_AIRTABLE_PAT():
            with open(log_REDACTED_AIRTABLE_PAT, 'r') as f:
                try:
                    log_data = json.load(f)
                except (json.JSONDecodeError, ValueError):
                    log_data = []
        else:
            log_data = []
        
        # Append new data
        log_data.append(input_data)
        
        # Write back to file with formatting
        with open(log_REDACTED_AIRTABLE_PAT, 'w') as f:
            json.dump(log_data, f, indent=2)
        
        sys.exit(0)
        
    except json.JSONDecodeError:
        # Handle JSON decode errors gracefully
        sys.exit(0)
    except Exception:
        # Exit cleanly on any other error
        sys.exit(0)

if __name__ == '__main__':
    main()