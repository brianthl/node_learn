# React Native Mobile Development Standards

## Performance Guidelines

### Graph Rendering Performance
- Maintain 60fps for graphs under 200 nodes
- Use React.memo for node components to prevent unnecessary re-renders
- Implement node virtualization for graphs exceeding 500 nodes
- Use React Native Reanimated 3 for smooth animations
- Avoid inline functions in render methods for graph components

### Memory Management
- Clean up graph event listeners on component unmount
- Use lazy loading for large knowledge maps
- Implement proper cleanup for WatermelonDB subscriptions
- Monitor memory usage during graph interactions

### Mobile-Specific Optimizations
- Use native driver for animations when possible
- Implement proper touch handling with PanGestureHandler
- Optimize image loading and caching for node icons
- Use InteractionManager for heavy operations

## Mobile UX Standards

### Touch Interactions
- Minimum 44px touch targets for accessibility compliance
- Implement haptic feedback for important actions (node selection, AI generation)
- Use proper loading states for AI operations (progress circles, skeleton screens)
- Provide visual feedback for all touch interactions within 100ms

### Gesture Vocabulary
- Single tap: Select/highlight
- Double tap: Edit mode
- Long press (2 seconds): AI activation with progress circle
- Pinch/zoom: Graph navigation (when no node selected)
- Pan: Graph movement (when no node selected)

### Responsive Design
- Support both portrait and landscape orientations
- Adapt UI for different screen sizes (phones, tablets)
- Use safe area insets for notched devices
- Implement proper keyboard avoidance for text inputs

## Code Organization Standards

### Component Structure
```typescript
// Preferred component organization
components/
  graph/
    GraphView.tsx          // Main graph container
    NodeComponent.tsx      // Individual node rendering
    EdgeComponent.tsx      // Connection rendering
    GraphControls.tsx      // Zoom, pan controls
  modes/
    BoltMode/
    StandardMode/
    RabbitHoleMode/
  shared/
    UI components
```

### State Management
- Use Zustand for global app state
- Keep graph-specific state in custom hooks
- Use WatermelonDB observers for reactive data
- Implement proper error boundaries for graph components

### Error Handling
- Graceful degradation when AI services fail
- Offline-first error handling with user feedback
- Proper validation for node depth and taxonomy
- Network error recovery with retry mechanisms

## Testing Standards

### Unit Testing
- Test all service classes (GraphService, AIService, SyncService)
- Mock WatermelonDB for consistent test environments
- Test graph algorithms (depth validation, node positioning)
- Validate AI cost calculations and caching

### Integration Testing
- Test mode switching workflows
- Validate sync operations between local and cloud
- Test cross-map node operations
- Verify AI integration end-to-end

### Performance Testing
- Benchmark graph rendering with various node counts
- Test memory usage during extended sessions
- Validate smooth animations on target devices
- Monitor AI API response times and costs