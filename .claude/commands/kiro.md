# Kiro-Style Spec-Driven Development Initializer

Transform the current repository into a Kiro-style spec-driven development project by analyzing existing code and documentation, then creating the three core specification files (requirements.md, design.md, tasks.md) along with supporting automation.

## Your Mission

1. **Analyze the Repository**
   - Examine all code, documentation, and structure
   - Identify implemented features and gaps
   - Extract implicit requirements from code and docs
   - Understand the architecture and design REDACTED_AIRTABLE_PAT

2. **Create Core Specification Files**
   - `requirements.md` - User stories with EARS acceptance criteria
   - `design.md` - Technical architecture with diagrams
   - `tasks.md` - Atomic implementation tasks with status tracking

3. **Set Up Automation**
   - Create checking and reporting scripts
   - Set up git hooks for spec maintenance
   - Add workflow documentation

4. **Initialize the Project**
   - Create necessary directories
   - Set up the scripts
   - Run initial sync check
   - Commit changes to a new branch

## Step-by-Step Process

### Phase 1: Discovery
1. Create a new branch called `kiro-spec-refactor`
2. Analyze the repository:
   - Read README.md and main documentation
   - Examine the main application files
   - Check for existing architecture docs
   - Look for TODO files or task lists
   - Review test files to understand features

### Phase 2: Requirements Extraction
Create `requirements.md` with:
- User stories derived from features
- EARS format acceptance criteria
- Non-functional requirements
- Security and compliance needs

**After completing each major section, add a dev note:**
```markdown
<!-- Dev Note [timestamp]: 
- Completed: [what was done]
- Source: [where info came from]
- Confidence: [high/medium/low]
- Questions: [any uncertainties]
-->
```

### Phase 3: Design Documentation
Create `design.md` with:
- Architecture overview (with Mermaid diagrams)
- Component design
- Data models
- API specifications
- Deployment architecture

**After completing each design section, add a dev note:**
```markdown
<!-- Dev Note [timestamp]:
- Section: [what was documented]
- Based on: [code files/REDACTED_AIRTABLE_PAT analyzed]
- Assumptions: [any assumptions made]
- Validation needed: [what should be verified]
-->
```

### Phase 4: Task Breakdown
Create `tasks.md` with:
- Implementation tasks linked to requirements
- Current status based on code analysis
- Dependencies between tasks
- Test requirements

**After completing task groups, add a dev note:**
```markdown
<!-- Dev Note [timestamp]:
- Tasks created: [count and type]
- Status determination: [how status was assessed]
- Priority reasoning: [why priorities were set]
- Dependencies identified: [key relationships]
-->
```

### Phase 5: Automation Setup
Copy from the Kiro scaffold:
```bash
~/.claude/kiro-scaffold/scripts/
  ├── check-spec-sync.sh
  ├── task-report.sh
  ├── update-task.sh
  └── setup-kiro-hooks.sh

~/.claude/kiro-scaffold/
  ├── KIRO_WORKFLOW.md
  └── .githooks/
      └── pre-commit
```

### Phase 6: Finalization
1. Run `./scripts/check-spec-sync.sh` to verify alignment
2. Create a summary report of what was found and created
3. Commit all changes with a comprehensive message

## Templates to Use

### Requirements Template
```markdown
# [Project Name] Requirements Specification

## Overview
[Brief project description]

<!-- Dev Note [timestamp]: 
- Completed: Initial overview based on README and main docs
- Source: README.md, package.json, main application files
- Confidence: high/medium/low
- Questions: [any areas needing clarification]
-->

## User Stories and Requirements

### 1. [Feature Category]

#### US-1.1: [Story Name]
**As a** [user type]  
**I want to** [action]  
**So that** [value]

**Acceptance Criteria (EARS Format):**
- WHEN [condition] THEN the system SHALL [behavior]

<!-- Dev Note [timestamp]: 
- Completed: [Feature category] requirements
- Source: [specific files/code analyzed]
- Confidence: [assessment]
- Questions: [uncertainties about feature scope]
-->
```

### Design Template
```markdown
# [Project Name] Technical Design

## Architecture Overview
[Description and architecture diagram]

<!-- Dev Note [timestamp]:
- Section: Architecture overview
- Based on: File structure, main entry points, dependency analysis
- Assumptions: [architectural REDACTED_AIRTABLE_PAT assumed]
- Validation needed: [areas to confirm with team]
-->

## Component Design
[Component descriptions and interfaces]

<!-- Dev Note [timestamp]:
- Section: Component design for [components]
- Based on: [specific files analyzed]
- Assumptions: [interface assumptions]
- Validation needed: [integration points to verify]
-->

## Data Models
[Database schemas and data structures]

<!-- Dev Note [timestamp]:
- Section: Data models
- Based on: Database migrations, model files, API responses
- Assumptions: [data relationship assumptions]
- Validation needed: [schema details to confirm]
-->
```

### Tasks Template
```markdown
# [Project Name] Implementation Tasks

## Overview
[Task tracking explanation]

## Phase 1: [Phase Name]

#### ⬜ T1.1.1: [Task Name]
- **Requirement**: US-X.Y
- **Design**: [Section]
- **Details**: [Implementation steps]
- **Test**: [Verification method]

<!-- Dev Note [timestamp] - Phase 1 Tasks:
- Tasks created: X tasks for [feature area]
- Status determination: Based on [what code/tests were checked]
- Priority reasoning: [why this phase is first]
- Dependencies identified: [key blocking relationships]
-->
```

## Key Principles

1. **Preserve Existing Work**: Don't delete existing docs, archive them
2. **Extract, Don't Invent**: Base specs on actual code and docs
3. **Mark Reality**: Set task status based on actual implementation
4. **Maintain Traceability**: Link everything together
5. **Enable Delegation**: Make tasks clear enough to hand off
6. **Document Your Process**: Leave dev notes showing your analysis and decisions

## Dev Note Guidelines

Dev notes serve as breadcrumbs for future maintainers and provide transparency about the spec creation process:

1. **When to Add Dev Notes**:
   - After completing each major section
   - When making significant assumptions
   - When identifying gaps or uncertainties
   - After determining task statuses

2. **What to Include**:
   - What was analyzed/completed
   - Source files or documentation used
   - Confidence level in the analysis
   - Assumptions made
   - Questions or areas needing validation

3. **Format**:
   - Use HTML comments so they don't render in preview
   - Include timestamp for chronological tracking
   - Be concise but informative
   - Focus on decisions and reasoning

## Success Criteria

- All major features have requirements
- Technical design matches actual architecture
- Tasks reflect real implementation status
- Automation scripts work correctly
- Initial spec sync check passes

## Final Output

Provide a summary:
```
🎉 Kiro-Style Refactoring Complete!

📊 Statistics:
- Requirements created: X
- Design sections: Y
- Total tasks: Z (A completed, B in progress, C pending)

📝 Key Findings:
- [Major feature areas identified]
- [Gaps discovered]
- [Technical debt noted]

🚀 Next Steps:
1. Review the specifications
2. Run ./scripts/setup-kiro-hooks.sh
3. Start working through pending tasks

The repository is now spec-driven! Use /spec-dev for ongoing assistance.
```

Remember: The goal is sustainable, documented development that enables effective delegation and long-term maintainability.