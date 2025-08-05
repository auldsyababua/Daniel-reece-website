#!/bin/bash

# Update task status in tasks.md

if [ $# -ne 2 ]; then
    echo "Usage: $0 <task-id> <status>"
    echo "Status options: not-started, in-progress, completed, blocked, needs-revision"
    echo "Example: $0 T2.1.1 completed"
    exit 1
fi

TASK_ID="$1"
NEW_STATUS="$2"
TASKS_FILE="tasks.md"

# Map status names to emoji
case "$NEW_STATUS" in
    "not-started")
        EMOJI="⬜"
        ;;
    "in-progress")
        EMOJI="🟨"
        ;;
    "completed")
        EMOJI="✅"
        ;;
    "blocked")
        EMOJI="❌"
        ;;
    "needs-revision")
        EMOJI="🔄"
        ;;
    *)
        echo "Error: Invalid status '$NEW_STATUS'"
        echo "Valid options: not-started, in-progress, completed, blocked, needs-revision"
        exit 1
        ;;
esac

if [ ! -f "$TASKS_FILE" ]; then
    echo "Error: $TASKS_FILE not found!"
    exit 1
fi

# Create backup
cp "$TASKS_FILE" "${TASKS_FILE}.bak"

# Find and update the task
if grep -q "$TASK_ID:" "$TASKS_FILE"; then
    # Use perl for more reliable in-place editing
    perl -i -pe "s/(#### )([⬜🟨✅❌🔄])( $TASK_ID:)/\${1}${EMOJI}\${3}/g" "$TASKS_FILE"
    
    echo "✅ Updated task $TASK_ID to status: $NEW_STATUS $EMOJI"
    echo ""
    echo "Updated line:"
    grep "$TASK_ID:" "$TASKS_FILE"
    
    # Add timestamp to task details if completed
    if [ "$NEW_STATUS" = "completed" ]; then
        TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
        # Add completion timestamp after the task line
        perl -i -pe "s/($TASK_ID:.*$)/\1\n- **Completed**: $TIMESTAMP/ if /$TASK_ID:/" "$TASKS_FILE"
    fi
else
    echo "Error: Task $TASK_ID not found in $TASKS_FILE"
    exit 1
fi

echo ""
echo "Backup saved as ${TASKS_FILE}.bak"