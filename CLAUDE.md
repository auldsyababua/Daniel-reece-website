# Claude Project Instructions

## Kiro Tools Available

This project has Kiro spec-driven development tools installed.
Note: Claude Code Hooks have been removed for cleaner project structure.
To reinstall full hooks + Kiro, run: `~/Desktop/projects/kirohooks-merge/install.sh`

## Kiro Spec-Driven Development

This repository uses Kiro spec-driven development methodology. When working on tasks:

### Specification Files
- **requirements.md** - User stories and acceptance criteria in EARS format
- **design.md** - Technical architecture and design decisions  
- **tasks.md** - Work breakdown with status tracking (⬜ → 🟨 → ✅)

### Before Making Changes
1. Check `tasks.md` for current task status and assignments
2. Reference the linked requirement in `requirements.md` for acceptance criteria
3. Follow architectural decisions documented in `design.md`
4. Ensure changes align with the specified design REDACTED_AIRTABLE_PAT

### After Completing Work
1. Run tests to verify acceptance criteria are met
2. Update task status in `tasks.md` (⬜ → ✅)
3. Commit changes with reference to task ID

### Task Status Meanings
- ⬜ Not Started
- 🟨 In Progress  
- ✅ Completed
- ❌ Blocked
- 🔄 Needs Revision

### Kiro Scripts Available
- `./check-spec-sync.sh` - Validate spec consistency
- `./task-report.sh` - Show task status report
- `./update-task.sh` - Update task status

## Working with Specs

When you see task references (like T1.2.3), I will:
1. Look up the full task details from tasks.md
2. Find the linked requirement from requirements.md
3. Check the relevant design section from design.md
4. Ensure all changes align with these specifications



## Hooks System Active

This project has Claude Code Hooks installed, providing:
- Security validation and dangerous command blocking
- Comprehensive logging of all actions
- Text-to-speech notifications
- Specialized sub-agents for delegated tasks
- Custom commands in .claude/commands/

## Kiro Spec-Driven Development

This repository uses Kiro spec-driven development methodology. When working on tasks:

### Specification Files
- **requirements.md** - User stories and acceptance criteria in EARS format
- **design.md** - Technical architecture and design decisions  
- **tasks.md** - Work breakdown with status tracking (⬜ → 🟨 → ✅)

### Before Making Changes
1. Check `tasks.md` for current task status and assignments
2. Reference the linked requirement in `requirements.md` for acceptance criteria
3. Follow architectural decisions documented in `design.md`
4. Ensure changes align with the specified design REDACTED_AIRTABLE_PAT

### After Completing Work
1. Run tests to verify acceptance criteria are met
2. Update task status in `tasks.md` (⬜ → ✅)
3. Commit changes with reference to task ID

### Task Status Meanings
- ⬜ Not Started
- 🟨 In Progress  
- ✅ Completed
- ❌ Blocked
- 🔄 Needs Revision

### Important Hooks Integration
The PreToolUse hook will validate changes against design specifications. The PostToolUse hook can auto-update task status when tests pass. Work within the scope of your current task to avoid validation warnings.

## Working with Specs

When you see task references (like T1.2.3), I will:
1. Look up the full task details from tasks.md
2. Find the linked requirement from requirements.md
3. Check the relevant design section from design.md
4. Ensure all changes align with these specifications

## Available Sub-Agents

You can delegate specialized tasks to agents in .claude/agents/:
- Use agents when their description matches your need
- Agents have specialized knowledge and focused tools
- Results are integrated back into our conversation
- Agents are project-agnostic and can be customized for your specific needs

## Security Notes

- Dangerous commands (rm -rf, etc.) are blocked by default
- .env files are protected from access
- All actions are logged for audit purposes
