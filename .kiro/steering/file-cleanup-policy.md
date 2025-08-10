# File Cleanup Policy

## Core Principle
Always maintain a clean codebase by removing obsolete files, unused components, and deprecated implementations when introducing new versions or refactored code.

## Mandatory Cleanup Actions

### When Creating New Implementations
- **Always delete the old version** before or immediately after creating the new one
- **Remove unused imports** and dependencies that are no longer needed
- **Clean up obsolete folders** that contain deprecated implementations
- **Update all references** to point to the new implementation

### File Replacement Rules
- **Component Replacements**: When creating `NewComponent.tsx`, delete `OldComponent.tsx`
- **Service Refactoring**: When creating `NewService.ts`, delete `OldService.ts` 
- **Layout Changes**: When implementing new layouts, remove old layout files
- **Folder Restructuring**: When moving to new folder structure, delete old folders after migration

### Specific Cleanup Scenarios

#### Component Evolution
```
// WRONG: Keeping both versions
src/components/graph/SimpleGraphDemo.tsx (old)
src/components/graph/ObsidianGraphView.tsx (new)

// RIGHT: Replace and clean up
src/components/graph/ObsidianGraphView.tsx (new only)
```

#### Service Layer Changes
```
// WRONG: Accumulating service files
src/services/OldStorageService.ts
src/services/StorageService.ts
src/services/NewStorageService.ts

// RIGHT: Single current implementation
src/services/StorageService.ts (current version only)
```

#### Folder Structure Updates
```
// WRONG: Multiple versions of same concept
knowledge-graph-app/ (old project)
knowledge-graph-app-v2/ (new project)

// RIGHT: Single clean project
knowledge-graph-app/ (updated with new implementation)
```

## Implementation Process

### Step 1: Identify Obsolete Files
Before implementing new features, identify which files will become obsolete:
- Old component implementations
- Deprecated service classes
- Unused utility functions
- Outdated configuration files
- Test files for removed functionality

### Step 2: Create Replacement
Implement the new version with improved functionality

### Step 3: Update References
Update all imports and references to use the new implementation

### Step 4: Delete Obsolete Files
Remove all files that are no longer needed:
```bash
# Delete old files
rm src/components/OldComponent.tsx
rm -rf src/old-folder/
rm src/services/DeprecatedService.ts
```

### Step 5: Clean Dependencies
Remove unused npm packages:
```bash
npm uninstall unused-package-1 unused-package-2
```

## Prohibited Practices

### Never Keep "Just in Case"
- **Don't** keep old files "just in case we need them"
- **Don't** comment out old code instead of deleting it
- **Don't** rename old files to `.backup` or `.old`
- **Don't** move old files to `/archive` or `/deprecated` folders

### Never Accumulate Versions
- **Don't** create `ComponentV1.tsx`, `ComponentV2.tsx`, `ComponentV3.tsx`
- **Don't** keep multiple project folders like `app-v1/`, `app-v2/`
- **Don't** maintain parallel implementations of the same feature

### Never Leave Dead Code
- **Don't** leave unused imports in files
- **Don't** keep commented-out code blocks
- **Don't** maintain unused utility functions
- **Don't** keep empty or placeholder files

## Quality Assurance

### Before Committing Changes
1. **Verify no broken imports** - ensure all references point to existing files
2. **Check for unused files** - identify files that are no longer referenced
3. **Validate functionality** - ensure the new implementation works completely
4. **Run tests** - confirm all tests pass with the new implementation
5. **Clean build** - ensure the project builds without warnings about missing files

### Regular Maintenance
- **Weekly cleanup** - review and remove any accumulated dead code
- **Feature completion** - clean up temporary/experimental files after feature completion
- **Refactoring sessions** - always include cleanup as part of refactoring
- **Code reviews** - include file cleanup verification in review process

## Automation Opportunities

### Git Hooks
Create pre-commit hooks to:
- Detect unused imports
- Identify unreferenced files
- Warn about potential dead code

### Build Process
Configure build tools to:
- Fail on unused imports
- Report unreferenced files
- Generate cleanup suggestions

### IDE Configuration
Set up IDE to:
- Highlight unused imports
- Show unreferenced files
- Auto-remove unused code on save

## Benefits of Clean Codebase

### Developer Experience
- **Faster navigation** - fewer files to search through
- **Clearer architecture** - obvious which files are current
- **Reduced confusion** - no ambiguity about which version to use
- **Easier onboarding** - new developers see only relevant code

### Maintenance Benefits
- **Smaller bundle size** - no unused code in production
- **Faster builds** - fewer files to process
- **Easier debugging** - clear code paths without dead ends
- **Better performance** - no overhead from unused imports

### Project Health
- **Clear git history** - obvious evolution of the codebase
- **Accurate documentation** - docs reflect actual implementation
- **Reliable testing** - tests cover only active code
- **Simplified deployment** - no confusion about which files to deploy

This policy ensures we maintain a professional, clean, and maintainable codebase by proactively removing obsolete code rather than letting it accumulate over time.