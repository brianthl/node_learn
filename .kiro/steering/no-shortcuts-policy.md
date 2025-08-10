# No Shortcuts Policy

## Core Principle
Never compromise on implementation quality or cut corners to make things "work quickly." Always implement the full, production-ready solution as specified in the requirements and design documents.

## Prohibited Shortcuts

### Database and Storage
- **Never** replace WatermelonDB with mock/simple storage just to avoid setup issues
- **Never** skip proper database model implementations
- **Never** use in-memory storage as a "temporary" solution
- **Always** implement the full offline-first architecture as designed

### Graph Visualization
- **Never** replace react-force-graph with simpler alternatives to avoid complexity
- **Never** skip the electron shell depth visualization system
- **Never** implement basic node rendering instead of the full taxonomy-based system
- **Always** implement the complete node selection and interaction system

### AI Integration
- **Never** mock AI services instead of implementing proper OpenAI integration
- **Never** skip cost management and caching systems
- **Never** implement placeholder responses instead of real AI functionality
- **Always** implement the full prompt engineering and response handling

### Mobile Optimization
- **Never** skip React Native performance optimizations
- **Never** ignore touch gesture requirements
- **Never** implement web-only solutions that don't work on mobile
- **Always** test on actual mobile devices, not just simulators

## Proper Problem-Solving Approach

### When Encountering Issues
1. **Diagnose the root cause** - Don't work around symptoms
2. **Fix the underlying problem** - Address configuration, setup, or architectural issues
3. **Implement the full solution** - Don't create "temporary" workarounds
4. **Test thoroughly** - Ensure the complete system works as designed

### Database Setup Issues
- Fix WatermelonDB configuration properly
- Ensure all models are correctly implemented
- Set up proper schema and migrations
- Configure platform-specific adapters correctly

### Graph Rendering Issues
- Fix react-force-graph integration properly
- Implement proper canvas rendering
- Handle mobile touch interactions correctly
- Optimize for performance without sacrificing features

### Build/Runtime Errors
- Fix babel/metro configuration issues
- Resolve dependency conflicts properly
- Address platform-specific compilation issues
- Ensure proper TypeScript configuration

## Quality Standards

### Code Quality
- All implementations must be production-ready
- Full error handling and edge case coverage
- Comprehensive unit and integration tests
- Proper TypeScript typing throughout

### Architecture Integrity
- Maintain offline-first design principles
- Preserve the three-mode system architecture
- Keep the electron shell visualization concept
- Maintain the six-taxonomy system

### Performance Requirements
- Meet all mobile performance targets
- Implement proper memory management
- Maintain 60fps graph rendering
- Optimize for battery usage

## Escalation Process

### When Stuck
1. **Research the proper solution** - Don't immediately look for shortcuts
2. **Ask for clarification** - If requirements are unclear, ask for details
3. **Propose architectural changes** - If design needs modification, discuss it
4. **Never implement shortcuts** - Even if it takes longer to do it right

### Communication
- Always explain why the full implementation is necessary
- Highlight the risks of shortcuts and technical debt
- Provide realistic timelines for proper implementation
- Suggest breaking work into smaller, complete pieces if needed

## Success Metrics

### Implementation Quality
- All features work as specified in requirements
- No "TODO" or "placeholder" implementations in production code
- Full test coverage for all implemented features
- Performance meets or exceeds targets

### Technical Debt
- Zero shortcuts or workarounds in the codebase
- All architectural decisions align with design documents
- No mock services or simplified implementations
- Complete error handling and edge case coverage

This policy ensures we build a robust, scalable, and maintainable knowledge graph application that meets all requirements without compromising on quality or cutting corners.