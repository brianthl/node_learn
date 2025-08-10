# Code Quality Review Hook

## Hook Configuration
- **Trigger**: On save of TypeScript files (*.ts, *.tsx)
- **Scope**: All source files in src/, components/, services/, controllers/
- **Execution**: Automatic when files are saved

## Review Checklist

### React Native Best Practices
- [ ] Components use React.memo for performance optimization
- [ ] No inline functions in render methods for graph components
- [ ] Proper cleanup of event listeners and subscriptions
- [ ] Native driver used for animations when possible
- [ ] Touch targets meet 44px minimum requirement

### Knowledge Graph Specific
- [ ] Node taxonomy validation (only 6 allowed categories)
- [ ] Depth validation (children > parent depth)
- [ ] Proper electron shell positioning constraints
- [ ] Graph performance considerations for large datasets
- [ ] Memory cleanup for graph components

### AI Integration
- [ ] Cost tracking implemented for AI operations
- [ ] Proper caching of AI responses
- [ ] Error handling for AI service failures
- [ ] User-triggered AI operations only (no automatic)
- [ ] Budget validation before expensive operations

### Mobile Performance
- [ ] 60fps target maintained for animations
- [ ] Proper memory management and cleanup
- [ ] Offline-first patterns implemented
- [ ] Battery optimization considerations
- [ ] Responsive design for different screen sizes

### Code Quality
- [ ] TypeScript types properly defined
- [ ] Error boundaries implemented where needed
- [ ] Proper async/await usage
- [ ] No console.log statements in production code
- [ ] Consistent naming conventions

## Automated Checks

### Performance Analysis
```typescript
// Check for performance anti-patterns
const performanceChecks = {
  // Detect inline functions in render
  inlineRenderFunctions: /render.*=.*\(.*\)\s*=>/g,
  
  // Check for missing React.memo
  unmemoizedComponents: /^const\s+\w+Component.*=.*\(/gm,
  
  // Detect missing cleanup
  missingCleanup: /useEffect.*\[\].*(?!.*return)/g
};
```

### Mobile Optimization Checks
- Verify touch target sizes in UI components
- Check for proper safe area usage
- Validate responsive design patterns
- Ensure proper keyboard handling

### Knowledge Graph Validation
- Validate taxonomy enum usage
- Check depth calculation logic
- Verify graph performance optimizations
- Ensure proper node relationship handling

## Action Items

When issues are found:
1. **High Priority**: Performance issues, memory leaks, incorrect taxonomy usage
2. **Medium Priority**: Missing optimizations, code style issues
3. **Low Priority**: Documentation improvements, minor refactoring opportunities

## Integration with Development Workflow

### Pre-commit Hooks
- Run TypeScript compilation
- Execute unit tests for modified files
- Validate code formatting
- Check for common anti-patterns

### Continuous Integration
- Full test suite execution
- Performance benchmarking
- Bundle size analysis
- Accessibility testing

## Reporting

Generate reports including:
- Code quality score
- Performance metrics
- Identified issues with severity
- Improvement recommendations
- Comparison with previous versions