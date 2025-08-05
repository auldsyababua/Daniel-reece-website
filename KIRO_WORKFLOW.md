# Kiro-Style Spec-Driven Development Workflow

## Overview

This repository has been refactored to follow Kiro IDE's spec-driven development methodology. All features are now documented through three core specification files that serve as the single source of truth.

## Core Specification Files

### 1. `requirements.md`
- **Purpose**: Documents what needs to be built
- **Format**: User stories with EARS (Easy Approach to Requirements Syntax) acceptance criteria
- **Example**: "WHEN a user sends /start THEN the system SHALL display a welcome message"

### 2. `design.md`
- **Purpose**: Documents how it will be built
- **Contains**: Architecture diagrams, data models, API specifications, component designs
- **Format**: Technical blueprints with Mermaid diagrams and interface definitions

### 3. `tasks.md`
- **Purpose**: Breaks down the work into actionable items
- **Format**: Atomic tasks with status tracking, dependencies, and links to requirements/design
- **Tracking**: Uses emoji indicators (⬜ 🟨 ✅ ❌ 🔄) for task status

## Workflow Process

### Adding a New Feature

1. **Start with Requirements**
   - Add user story to `requirements.md`
   - Define acceptance criteria in EARS format
   - Ensure requirements are testable

2. **Design the Solution**
   - Update `design.md` with technical approach
   - Add architecture diagrams if needed
   - Define data models and APIs

3. **Break Down Tasks**
   - Add implementation tasks to `tasks.md`
   - Link each task to requirements and design
   - Set dependencies between tasks

4. **Implement**
   - Work through tasks in order
   - Update task status as you progress
   - Refer back to requirements and design

5. **Maintain Sync**
   - If implementation reveals issues, update specs
   - Keep all three files in sync
   - Document any deviations

## Quick Commands

### Check Specification Sync
```bash
# Run the spec sync checker
./scripts/check-spec-sync.sh
```

### Generate Task Report
```bash
# See current task status
./scripts/task-report.sh
```

### Update Task Status
```bash
# Mark a task as complete
./scripts/update-task.sh T2.1.1 completed
```

## Benefits of This Approach

1. **Clear Traceability**: Every piece of code traces back to a requirement
2. **Better Planning**: Design decisions are documented before coding
3. **Progress Visibility**: Task status shows exactly what's done
4. **Maintainability**: New developers understand the why, what, and how
5. **Reduced Technical Debt**: Specifications prevent "vibe coding"

## Common Patterns

### Requirement Pattern
```markdown
#### US-X.Y: User Story Title
**As a** [user type]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- WHEN [condition] THEN the system SHALL [behavior]
- IF [condition] THEN the system SHALL [behavior]

<!-- Dev Note [timestamp]: 
- Completed: [What section/category]
- Source: [Code/docs analyzed]
- Confidence: [high/medium/low]
- Questions: [Any uncertainties]
-->
```

### Design Pattern
```markdown
### Component Name

#### Architecture
[Mermaid diagram]

#### Interface
```python
class ComponentName:
    def method(params) -> ReturnType
```

#### Data Model
```sql
CREATE TABLE table_name (...)
```

<!-- Dev Note [timestamp]:
- Section: [Component/design area]
- Based on: [Files analyzed]
- Assumptions: [Design decisions made]
- Validation needed: [What to verify]
-->
```

### Task Pattern
```markdown
#### ⬜ T#.#.#: Task Title
- **Requirement**: US-X.Y
- **Design**: Section Name
- **Details**: 
  - Specific implementation steps
  - Key considerations
- **Test**: How to verify completion

<!-- Dev Note [timestamp] - Task Group:
- Tasks created: [Count and type]
- Status determination: [How assessed]
- Priority reasoning: [Why ordered this way]
- Dependencies identified: [Key relationships]
-->
```

### Dev Note Pattern
Dev notes provide transparency about the specification creation process and should be added:
- After completing major sections
- When making assumptions or design decisions  
- When identifying gaps or uncertainties
- To explain task status determinations

Format as HTML comments so they don't render in preview but remain visible in source.

## Migration Notes

This repository was migrated from a traditional structure where:
- Requirements were implicit in code and READMEs
- Design was scattered across multiple documents
- Tasks were tracked in various TODO files

All of this has been consolidated into the three core specification files. Previous documentation has been moved to the `archive/` directory for reference.

## Maintaining Specifications

1. **Before Starting Work**: Always check requirements first
2. **During Development**: Update task status in real-time
3. **After Completion**: Ensure specs match implementation
4. **Code Reviews**: Verify changes align with specifications

Remember: The specifications are living documents. They should evolve with the project while maintaining their role as the authoritative source of truth.