#!/usr/bin/env python3
"""Test script to verify the session_start.py hook is working correctly."""

import json
import subprocess
import sys
from pathlib import Path

def test_hook():
    """Test the session_start.py hook with various inputs."""
    
    hook_path = Path(".claude/hooks/session_start.py")
    
    if not hook_path.exists():
        print("❌ Hook file not found at .claude/hooks/session_start.py")
        return False
    
    print("✅ Hook file exists")
    
    # Test cases
    test_cases = [
        {
            "name": "Startup session",
            "input": {"session_id": "test-startup", "source": "startup"}
        },
        {
            "name": "Resume session",
            "input": {"session_id": "test-resume", "source": "resume"}
        },
        {
            "name": "Clear session",
            "input": {"session_id": "test-clear", "source": "clear"}
        }
    ]
    
    all_passed = True
    
    for test in test_cases:
        print(f"\nTesting: {test['name']}")
        input_json = json.dumps(test['input'])
        
        try:
            # Run the hook with uv
            result = subprocess.run(
                ["uv", "run", "--script", str(hook_path)],
                input=input_json,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                print(f"  ✅ Passed - Exit code: {result.returncode}")
                if result.stdout:
                    print(f"  Output: {result.stdout[:100]}...")
            else:
                print(f"  ❌ Failed - Exit code: {result.returncode}")
                if result.stderr:
                    print(f"  Error: {result.stderr}")
                all_passed = False
                
        except subprocess.TimeoutExpired:
            print(f"  ❌ Failed - Timeout")
            all_passed = False
        except Exception as e:
            print(f"  ❌ Failed - Exception: {e}")
            all_passed = False
    
    # Check if logs directory was created
    log_dir = Path("logs")
    if log_dir.exists():
        print(f"\n✅ Logs directory created")
        log_file = log_dir / "session_start.json"
        if log_file.exists():
            print(f"✅ Log file created at logs/session_start.json")
            with open(log_file, 'r') as f:
                try:
                    logs = json.load(f)
                    print(f"  Contains {len(logs)} log entries")
                except json.JSONDecodeError:
                    print("  ⚠️  Log file exists but contains invalid JSON")
    
    return all_passed

if __name__ == "__main__":
    print("=" * 60)
    print("Session Start Hook Test")
    print("=" * 60)
    
    success = test_hook()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ All tests passed! Hook is working correctly.")
    else:
        print("❌ Some tests failed. Please review the errors above.")
    print("=" * 60)
    
    sys.exit(0 if success else 1)