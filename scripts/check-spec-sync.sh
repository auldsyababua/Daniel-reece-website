#!/bin/bash

# Check specification sync - ensures requirements, design, and tasks are aligned

echo "🔍 Checking specification synchronization..."
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if core files exist
REQ_FILE="requirements.md"
DESIGN_FILE="design.md"
TASKS_FILE="tasks.md"

missing_files=0

if [ ! -f "$REQ_FILE" ]; then
    echo -e "${RED}❌ Missing $REQ_FILE${NC}"
    missing_files=$((missing_files + 1))
else
    echo -e "${GREEN}✅ Found $REQ_FILE${NC}"
fi

if [ ! -f "$DESIGN_FILE" ]; then
    echo -e "${RED}❌ Missing $DESIGN_FILE${NC}"
    missing_files=$((missing_files + 1))
else
    echo -e "${GREEN}✅ Found $DESIGN_FILE${NC}"
fi

if [ ! -f "$TASKS_FILE" ]; then
    echo -e "${RED}❌ Missing $TASKS_FILE${NC}"
    missing_files=$((missing_files + 1))
else
    echo -e "${GREEN}✅ Found $TASKS_FILE${NC}"
fi

if [ $missing_files -gt 0 ]; then
    echo -e "\n${RED}Cannot check sync - missing core specification files${NC}"
    exit 1
fi

echo -e "\n📋 Checking requirement references in tasks..."

# Extract all US-X.Y references from requirements.md
req_ids=$(grep -E "^#### US-[0-9]+\.[0-9]+:" "$REQ_FILE" | sed -E 's/#### (US-[0-9]+\.[0-9]+):.*/\1/' | sort -u)
req_count=$(echo "$req_ids" | wc -l | tr -d ' ')
echo "Found $req_count requirements in $REQ_FILE"

# Check which requirements are referenced in tasks.md
unreferenced=0
for req in $req_ids; do
    if ! grep -q "$req" "$TASKS_FILE"; then
        echo -e "${YELLOW}⚠️  Requirement $req has no tasks${NC}"
        unreferenced=$((unreferenced + 1))
    fi
done

if [ $unreferenced -eq 0 ]; then
    echo -e "${GREEN}✅ All requirements have associated tasks${NC}"
else
    echo -e "${YELLOW}⚠️  $unreferenced requirements lack tasks${NC}"
fi

echo -e "\n🏗️  Checking design references in tasks..."

# Extract all design sections from design.md
design_sections=$(grep -E "^###? " "$DESIGN_FILE" | sed -E 's/^###? //' | grep -v "^#" | sort -u)

# Count tasks that reference design sections
tasks_with_design=$(grep -c "**Design**:" "$TASKS_FILE" || echo "0")
total_tasks=$(grep -cE "^#### .* T[0-9]+\\.[0-9]+\\.[0-9]+:" "$TASKS_FILE" || echo "0")

echo "$tasks_with_design of $total_tasks tasks reference design sections"

if [ $tasks_with_design -lt $total_tasks ]; then
    tasks_without_design=$((total_tasks - tasks_with_design))
    echo -e "${YELLOW}⚠️  $tasks_without_design tasks lack design references${NC}"
else
    echo -e "${GREEN}✅ All tasks reference design sections${NC}"
fi

echo -e "\n📊 Task Status Summary:"

# Count task statuses
not_started=$(grep -c "⬜" "$TASKS_FILE")
in_progress=$(grep -c "🟨" "$TASKS_FILE")
completed=$(grep -c "✅" "$TASKS_FILE")
blocked=$(grep -c "❌" "$TASKS_FILE")
needs_revision=$(grep -c "🔄" "$TASKS_FILE")

echo -e "⬜ Not Started: $not_started"
echo -e "🟨 In Progress: $in_progress"
echo -e "✅ Completed: $completed"
echo -e "❌ Blocked: $blocked"
echo -e "🔄 Needs Revision: $needs_revision"

total_counted=$((not_started + in_progress + completed + blocked + needs_revision))
echo -e "\nTotal tasks tracked: $total_counted"

# Calculate completion percentage
if [ $total_counted -gt 0 ]; then
    completion_percent=$((completed * 100 / total_counted))
    echo -e "\n📈 Completion: ${completion_percent}%"
fi

echo -e "\n==========================================="
echo "✨ Specification sync check complete"

# Exit with warning if issues found
if [ $unreferenced -gt 0 ] || [ $tasks_without_design -gt 0 ]; then
    exit 2  # Warning exit code
fi

exit 0