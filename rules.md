# DECA Study App - Development Rules

## Mandatory Workflow Requirements

### 1. Pre-Development Documentation Updates

**BEFORE making ANY changes to the project, ALWAYS:**

#### For Feature Requests or Changes:
1. **Update PRD.md** - Add/modify requirements in the appropriate section
2. **Update TODO.md** - Add tasks to appropriate section (🚨 Critical, 🚧 In Progress, etc.)
3. **Update TodoWrite** - Add implementation tasks with proper status tracking

#### For Bug Reports:
1. **Update TODO.md** - Add bug fix tasks to appropriate priority section
2. **Update TodoWrite** - Add bug fix tasks with clear description

#### For All Changes:
1. **Update log.md** - Document what you're about to do and why
2. **Never skip documentation** - This ensures continuity between sessions

### 2. Documentation Standards

#### PRD.md Updates:
- **New Features**: Add to appropriate functional section with ✅/🚧/🔴 status
- **Enhancements**: Update existing feature descriptions
- **Future Items**: Add to section 8 (Future Roadmap) with priority level
- **Status Updates**: Maintain accurate implementation status indicators

#### TODO.md Updates:
- **Section Organization**: Use appropriate headers (🚨 Critical Fix, 🚧 In Progress, etc.)
- **Task Grouping**: Group related tasks into phases or feature sections
- **Checkbox Format**: Use - [ ] for pending, - [x] for completed
- **Time Estimates**: Include estimated hours for major tasks
- **Status Summary**: Keep "Current Status Summary" section updated

#### TodoWrite Updates:
- **Clear Descriptions**: Use actionable language ("Fix X", "Implement Y", "Add Z")
- **Proper Status Tracking**: pending → in_progress → completed
- **Priority Order**: High priority items first
- **Active Form**: Always include present continuous form for in_progress items
- **Sync with TODO.md**: Ensure tasks match those in TODO.md file

#### log.md Updates:
- **Session Headers**: Date and session identifier
- **Action Items**: What was planned vs. what was accomplished
- **Decisions Made**: Technical choices and rationale
- **Issues Encountered**: Problems and their solutions
- **Next Steps**: What should happen next

### 3. Development Process

#### Before Starting Work:
1. ✅ Update PRD.md (if feature/change)
2. ✅ Update TODO.md with tasks in appropriate sections
3. ✅ Update TodoWrite with tasks (matching TODO.md)
4. ✅ Log session start in log.md
5. ✅ Mark appropriate todo as in_progress (in both TODO.md and TodoWrite)

#### During Development:
- Update todo status in both TODO.md and TodoWrite as work progresses
- Check off completed items in TODO.md with [x]
- Move items between sections in TODO.md as status changes
- Log significant decisions or issues in log.md
- Maintain only ONE todo as in_progress at a time

#### After Completing Work:
1. ✅ Mark todos as completed in TodoWrite immediately
2. ✅ Check off completed items [x] in TODO.md
3. ✅ Move completed items to archive if major feature
4. ✅ Update PRD.md status if applicable
5. ✅ Log completion and results in log.md
6. ✅ **Test the changes thoroughly**
7. ✅ Run lint/typecheck if available
8. ✅ **NEVER ask user to test - always test yourself first**
9. ✅ **ALWAYS commit and push changes to GitHub immediately**
10. ✅ **Inform user that changes are pushed and ready to test**

#### Testing & Deployment:
- **When making changes that need user testing**: Automatically commit and push to deploy on Vercel
- **This ensures the user can test the latest changes** without having to ask for deployment
- **Commands to remember**:
  - Lint: `npm run lint`
  - Type check: `npm run typecheck`

### 4. File Organization

```
deca-study-app/
├── PRD.md           # Product Requirements (master spec)
├── TODO.md          # Master task list with priorities and status
├── TODO.archive.md  # Completed features archive
├── rules.md         # This file (workflow rules)
├── log.md           # Development session logs
└── [project files]
```

### 5. Session Continuity

#### Starting a New Session:
1. **Read log.md** to understand recent changes
2. **Review TODO.md** for current priorities and task organization
3. **Check TodoWrite** for current task status (should match TODO.md)
4. **Review PRD.md** for any specification updates
5. **Log session start** with context from previous session

#### Ending a Session:
1. **Update TODO.md** with completed items checked off [x]
2. **Update TodoWrite** to reflect current status (matching TODO.md)
3. **Archive completed features** to TODO.archive.md if appropriate
4. **Log session summary** with accomplishments and blockers
5. **Document next steps** for future sessions

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
- Keep PRD.md, TODO.md, and TodoWrite synchronized with implementation
- TODO.md and TodoWrite should always reflect the same tasks and status
- Use clear, specific language in all documentation
- Maintain accurate status indicators (✅/🚧/🔴) in PRD.md
- Use checkbox format (- [ ]/- [x]) in TODO.md

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
*Updated: September 15, 2025*
*Version: 1.1*
*Status: Active*