# Performance Optimization Guidelines

## Graph Rendering Performance

### Node Count Thresholds
- **Small Graphs (< 200 nodes)**: Full force-directed layout with 60fps animations
- **Medium Graphs (200-500 nodes)**: Optimized layout with reduced animation complexity
- **Large Graphs (> 500 nodes)**: Hierarchical layout with node virtualization
- **Critical Threshold**: Implement emergency fallbacks at 1000+ nodes

### Rendering Optimizations
```typescript
// Preferred rendering patterns
const GraphOptimizations = {
  // Use React.memo for node components
  NodeComponent: React.memo(({ node, isSelected }) => { ... }),
  
  // Implement viewport culling
  renderVisibleNodes: (viewport: Viewport, nodes: Node[]) => {
    return nodes.filter(node => isInViewport(node, viewport));
  },
  
  // Batch DOM updates
  updateNodePositions: (nodes: Node[]) => {
    requestAnimationFrame(() => {
      nodes.forEach(node => updatePosition(node));
    });
  }
};
```

### Animation Performance
- **Use Native Driver**: Enable native driver for all animations when possible
- **Reduce Animation Complexity**: Simplify animations for large graphs
- **Frame Rate Monitoring**: Target 60fps, fallback to 30fps if needed
- **Animation Cancellation**: Cancel animations when user interacts
- **Memory Cleanup**: Properly dispose of animation resources

## Memory Management

### WatermelonDB Optimization
- **Query Optimization**: Use indexed queries for large datasets
- **Subscription Management**: Clean up database observers on unmount
- **Batch Operations**: Group database writes for efficiency
- **Memory Monitoring**: Track database memory usage
- **Cache Management**: Implement LRU cache for frequently accessed nodes

### Graph Data Management
```typescript
class GraphMemoryManager {
  private nodeCache = new Map<string, Node>();
  private maxCacheSize = 1000;
  
  // LRU cache implementation
  getNode(id: string): Node | undefined {
    const node = this.nodeCache.get(id);
    if (node) {
      // Move to end (most recently used)
      this.nodeCache.delete(id);
      this.nodeCache.set(id, node);
    }
    return node;
  }
  
  // Cleanup when cache exceeds limit
  evictOldNodes(): void {
    while (this.nodeCache.size > this.maxCacheSize) {
      const firstKey = this.nodeCache.keys().next().value;
      this.nodeCache.delete(firstKey);
    }
  }
}
```

### Component Lifecycle Management
- **Proper Cleanup**: Remove event listeners and subscriptions
- **Lazy Loading**: Load components only when needed
- **Component Pooling**: Reuse components for similar nodes
- **State Cleanup**: Clear component state on unmount
- **Memory Leak Detection**: Monitor for memory leaks in development

## Network and Sync Performance

### Offline-First Optimization
- **Local-First Operations**: All operations work locally first
- **Batch Sync**: Group sync operations for efficiency
- **Incremental Sync**: Only sync changed data
- **Compression**: Compress sync payloads when beneficial
- **Connection Awareness**: Adapt behavior based on connection quality

### AI Request Optimization
- **Request Batching**: Group similar AI requests
- **Response Caching**: Cache AI responses aggressively
- **Request Deduplication**: Avoid duplicate requests
- **Timeout Management**: Set appropriate timeouts for AI requests
- **Retry Strategy**: Exponential backoff for failed requests

### Sync Queue Management
```typescript
class SyncQueueOptimizer {
  private queue: SyncOperation[] = [];
  private batchSize = 10;
  private batchTimeout = 5000; // 5 seconds
  
  // Batch operations for efficiency
  async processBatch(): Promise<void> {
    const batch = this.queue.splice(0, this.batchSize);
    if (batch.length > 0) {
      await this.syncBatch(batch);
    }
  }
  
  // Prioritize operations
  prioritizeOperations(): void {
    this.queue.sort((a, b) => {
      // Prioritize creates over updates over deletes
      const priority = { create: 3, update: 2, delete: 1 };
      return priority[b.type] - priority[a.type];
    });
  }
}
```

## Mobile-Specific Optimizations

### Touch Performance
- **Touch Debouncing**: Prevent rapid-fire touch events
- **Gesture Optimization**: Use native gesture handlers when possible
- **Touch Target Sizing**: Ensure 44px minimum touch targets
- **Haptic Feedback**: Use sparingly to avoid battery drain
- **Touch Response Time**: Provide feedback within 100ms

### Battery Optimization
- **Background Processing**: Minimize background operations
- **Screen Wake**: Avoid keeping screen awake unnecessarily
- **Network Usage**: Batch network operations
- **CPU Usage**: Optimize algorithms for mobile CPUs
- **Animation Efficiency**: Use GPU-accelerated animations

### Storage Optimization
- **Database Size**: Monitor and limit database growth
- **File Cleanup**: Remove unused cached files
- **Compression**: Compress large text content
- **Storage Monitoring**: Track available device storage
- **Cleanup Strategies**: Implement automatic cleanup routines

## Monitoring and Metrics

### Performance Metrics
```typescript
interface PerformanceMetrics {
  // Rendering performance
  averageFPS: number;
  nodeRenderTime: number;
  graphLayoutTime: number;
  
  // Memory usage
  memoryUsage: number;
  cacheHitRate: number;
  databaseSize: number;
  
  // Network performance
  syncLatency: number;
  aiResponseTime: number;
  offlineQueueSize: number;
  
  // User experience
  interactionResponseTime: number;
  errorRate: number;
  crashRate: number;
}
```

### Performance Monitoring
- **Real-time Monitoring**: Track performance during development
- **User Analytics**: Monitor performance in production
- **Crash Reporting**: Implement comprehensive crash reporting
- **Performance Alerts**: Alert on performance degradation
- **Optimization Tracking**: Measure impact of optimizations

### Benchmarking
- **Baseline Measurements**: Establish performance baselines
- **Regression Testing**: Detect performance regressions
- **Device Testing**: Test on various device capabilities
- **Load Testing**: Test with large datasets
- **Stress Testing**: Test under extreme conditions

## Optimization Strategies

### Progressive Enhancement
- **Core Functionality First**: Ensure basic features work on all devices
- **Feature Detection**: Enable advanced features based on device capabilities
- **Graceful Degradation**: Fallback to simpler implementations when needed
- **Performance Budgets**: Set and enforce performance budgets
- **Continuous Optimization**: Regularly review and optimize performance

### Code Splitting and Lazy Loading
- **Route-Based Splitting**: Split code by app sections
- **Component Lazy Loading**: Load components on demand
- **Dynamic Imports**: Use dynamic imports for large dependencies
- **Bundle Analysis**: Regularly analyze bundle size
- **Tree Shaking**: Eliminate unused code

### Caching Strategies
- **Multi-Level Caching**: Implement caching at multiple levels
- **Cache Invalidation**: Implement proper cache invalidation
- **Cache Warming**: Pre-populate caches with likely-needed data
- **Cache Monitoring**: Monitor cache hit rates and effectiveness
- **Cache Optimization**: Regularly optimize caching strategies