#!/bin/bash

# Generate a task status report from tasks.md

echo "📋 BrainBot Task Status Report"
echo "============================"
date
echo ""

TASKS_FILE="tasks.md"

if [ ! -f "$TASKS_FILE" ]; then
    echo "Error: $TASKS_FILE not found!"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Function to print phase summary
print_phase_summary() {
    local phase_name="$1"
    local phase_REDACTED_AIRTABLE_PAT="$2"
    
    echo -e "\n${BLUE}$phase_name${NC}"
    echo "----------------------------------------"
    
    # Extract tasks for this phase
    awk -v REDACTED_AIRTABLE_PAT="$phase_REDACTED_AIRTABLE_PAT" '
        BEGIN { in_phase = 0; }
        /^## Phase/ { in_phase = 0; }
        $0 ~ REDACTED_AIRTABLE_PAT { in_phase = 1; }
        in_phase && /^#### / { print }
    ' "$TASKS_FILE" | while read -r line; do
        if [[ "$line" == *"⬜"* ]]; then
            echo -e "${RED}$line${NC}"
        elif [[ "$line" == *"🟨"* ]]; then
            echo -e "${YELLOW}$line${NC}"
        elif [[ "$line" == *"✅"* ]]; then
            echo -e "${GREEN}$line${NC}"
        elif [[ "$line" == *"❌"* ]]; then
            echo -e "${RED}$line${NC}"
        elif [[ "$line" == *"🔄"* ]]; then
            echo -e "${MAGENTA}$line${NC}"
        fi
    done
}

# Overall statistics
echo -e "${BLUE}📊 Overall Statistics${NC}"
echo "----------------------------------------"

not_started=$(grep -c "⬜" "$TASKS_FILE")
in_progress=$(grep -c "🟨" "$TASKS_FILE")
completed=$(grep -c "✅" "$TASKS_FILE")
blocked=$(grep -c "❌" "$TASKS_FILE")
needs_revision=$(grep -c "🔄" "$TASKS_FILE")

total=$((not_started + in_progress + completed + blocked + needs_revision))

echo -e "⬜ Not Started:    $not_started"
echo -e "🟨 In Progress:    $in_progress"
echo -e "✅ Completed:      $completed"
echo -e "❌ Blocked:        $blocked"
echo -e "🔄 Needs Revision: $needs_revision"
echo -e "\nTotal Tasks: $total"

if [ $total -gt 0 ]; then
    completion_percent=$((completed * 100 / total))
    echo -e "\n🎯 Completion: ${GREEN}${completion_percent}%${NC}"
fi

# Phase summaries
print_phase_summary "Phase 1: Core Functionality (MVP)" "^## Phase 1:"
print_phase_summary "Phase 2: Smart Rails Enhancement" "^## Phase 2:"
print_phase_summary "Phase 3: Memory Integration" "^## Phase 3:"
print_phase_summary "Phase 4: Document Processing" "^## Phase 4:"
print_phase_summary "Phase 5: Performance & Monitoring" "^## Phase 5:"
print_phase_summary "Phase 6: Testing & Documentation" "^## Phase 6:"

# In Progress Tasks Detail
echo -e "\n${YELLOW}🟨 Currently In Progress${NC}"
echo "----------------------------------------"
grep -A 4 "🟨" "$TASKS_FILE" | grep -E "(^#### |•|Details:)" | sed 's/^/  /'

# Blocked Tasks Detail
if [ $blocked -gt 0 ]; then
    echo -e "\n${RED}❌ Blocked Tasks${NC}"
    echo "----------------------------------------"
    grep -A 4 "❌" "$TASKS_FILE" | grep -E "(^#### |•|Details:)" | sed 's/^/  /'
fi

# Next Up (first 5 not started tasks)
echo -e "\n${BLUE}🔜 Next Up${NC}"
echo "----------------------------------------"
grep "⬜" "$TASKS_FILE" | head -5 | while read -r line; do
    echo "  $line"
done

echo -e "\n============================"
echo "Report generated successfully"
echo ""
echo "Tip: Use './scripts/update-task.sh <task-id> <status>' to update task status"
echo "Status options: not-started, in-progress, completed, blocked, needs-revision"