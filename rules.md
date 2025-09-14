# DECA Study App - Development Rules

## Mandatory Workflow Requirements

### 1. Pre-Development Documentation Updates

**BEFORE making ANY changes to the project, ALWAYS:**

#### For Feature Requests or Changes:
1. **Update PRD.md** - Add/modify requirements in the appropriate section
2. **Update TodoWrite** - Add implementation tasks with proper status tracking

#### For Bug Reports:
1. **Update TodoWrite** - Add bug fix tasks with clear description

#### For All Changes:
1. **Update log.md** - Document what you're about to do and why
2. **Never skip documentation** - This ensures continuity between sessions

### 2. Documentation Standards

#### PRD.md Updates:
- **New Features**: Add to appropriate functional section with ✅/🚧/🔴 status
- **Enhancements**: Update existing feature descriptions
- **Future Items**: Add to section 8 (Future Roadmap) with priority level
- **Status Updates**: Maintain accurate implementation status indicators

#### TodoWrite Updates:
- **Clear Descriptions**: Use actionable language ("Fix X", "Implement Y", "Add Z")
- **Proper Status Tracking**: pending → in_progress → completed
- **Priority Order**: High priority items first
- **Active Form**: Always include present continuous form for in_progress items

#### log.md Updates:
- **Session Headers**: Date and session identifier
- **Action Items**: What was planned vs. what was accomplished
- **Decisions Made**: Technical choices and rationale
- **Issues Encountered**: Problems and their solutions
- **Next Steps**: What should happen next

### 3. Development Process

#### Before Starting Work:
1. ✅ Update PRD.md (if feature/change)
2. ✅ Update TodoWrite with tasks
3. ✅ Log session start in log.md
4. ✅ Mark appropriate todo as in_progress

#### During Development:
- Update todo status as work progresses
- Log significant decisions or issues in log.md
- Maintain only ONE todo as in_progress at a time

#### After Completing Work:
1. ✅ Mark todos as completed immediately
2. ✅ Update PRD.md status if applicable
3. ✅ Log completion and results in log.md
4. ✅ **Test the changes thoroughly**
5. ✅ Run lint/typecheck if available
6. ✅ **NEVER ask user to test - always test yourself first**

### 4. File Organization

```
deca-study-app/
├── PRD.md           # Product Requirements (master spec)
├── rules.md         # This file (workflow rules)
├── log.md           # Development session logs
└── [project files]
```

### 5. Session Continuity

#### Starting a New Session:
1. **Read log.md** to understand recent changes
2. **Check TodoWrite** for current task status
3. **Review PRD.md** for any specification updates
4. **Log session start** with context from previous session

#### Ending a Session:
1. **Update all todos** to reflect current status
2. **Log session summary** with accomplishments and blockers
3. **Document next steps** for future sessions

### 6. Quality Standards

#### Code Changes:
- Always run linting and type checking
- **Test functionality thoroughly before marking todos complete**
- **Test all user interactions and edge cases**
- **Verify fixes actually work - never assume**
- Follow existing code patterns and conventions
- Never commit broken code
- **CRITICAL: Test before presenting to user**

#### Documentation:
- Keep PRD.md and todos synchronized with implementation
- Use clear, specific language in all documentation
- Maintain accurate status indicators (✅/🚧/🔴)

### 7. Communication

#### Todo Descriptions:
- **Good**: "Fix InfoHelp component integration - currently shows placeholder instead of implemented help content"
- **Bad**: "Fix help page"

#### PRD Updates:
- **Good**: Specific feature descriptions with acceptance criteria
- **Bad**: Vague requirements without clear implementation guidance

#### Log Entries:
- **Good**: "Implemented quit button in StudySession component, added session summary modal, cleared localStorage on quit"
- **Bad**: "Fixed study stuff"

## Enforcement

**These rules are MANDATORY for all development work.**

Failure to follow these rules can result in:
- Lost context between sessions
- Incomplete feature implementations
- Inconsistent documentation
- Difficulty tracking progress
- **Wasted user time testing broken features**

**Always prioritize documentation updates BEFORE code changes.**
**Always test thoroughly BEFORE presenting to user.**

---

*Created: September 14, 2025*
*Version: 1.0*
*Status: Active*