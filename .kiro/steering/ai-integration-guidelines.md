# AI Integration Guidelines

## Cost Management Principles

### Budget Control
- **Daily Budget**: Target $5 per day maximum for AI operations
- **User-Triggered Only**: Never run automatic AI processing
- **Predictable Pricing**: Provide cost estimates before operations
- **Budget Tracking**: Monitor and display current spending to users
- **Graceful Degradation**: App functions fully without AI features

### Caching Strategy
- **Single-Layer Cache**: Use SQLite for AI response storage
- **Cache Keys**: MD5 hash of request parameters (nodeId + mode + taxonomy)
- **TTL Management**: Reasonable expiration times for cached responses
- **Cache Invalidation**: Clear cache when node content significantly changes
- **Hit Rate Optimization**: Prioritize caching for expensive operations

### Request Optimization
- **Batch Processing**: Group similar requests when possible
- **Token Efficiency**: Use minimal context in prompts
- **Response Parsing**: Validate and sanitize AI responses
- **Retry Logic**: Exponential backoff for failed requests
- **Rate Limiting**: Respect OpenAI API limits

## Prompt Engineering Standards

### Taxonomy-Specific Prompts
```typescript
const PROMPTS = {
  concept: "For the concept '{topic}', suggest 3 child concepts that define or categorize it. Context: {content}",
  process: "For the process '{topic}', suggest 3 sub-processes or steps. Context: {content}",
  component: "For '{topic}', suggest 3 key components or parts. Context: {content}",
  cause: "For '{topic}', suggest 3 causes, effects, or related causal factors. Context: {content}",
  context: "For '{topic}', suggest 3 contextual factors or background elements. Context: {content}",
  complementary: "For '{topic}', suggest 3 complementary or related concepts at the same level. Context: {content}"
};
```

### Response Format Requirements
- **Structured JSON**: Always request JSON responses for parsing
- **Consistent Schema**: Standardize response format across all prompts
- **Error Handling**: Include fallback responses for malformed AI output
- **Validation**: Verify response structure before processing
- **Content Limits**: Enforce reasonable length limits for generated content

### Context Management
- **Minimal Context**: Include only necessary information in prompts
- **Token Counting**: Monitor token usage for cost control
- **Context Relevance**: Ensure context directly relates to the request
- **Privacy Considerations**: Avoid sending sensitive user data
- **Content Filtering**: Sanitize user input before sending to AI

## Integration Patterns

### Service Architecture
```typescript
class AIService {
  // Core methods with cost tracking
  async generateChildNodes(parentNode: Node, mode: 'abstract' | 'detailed'): Promise<AISuggestion[]>
  async suggestTaxonomy(topic: string): Promise<TaxonomyType>
  async convertTextToNodes(text: string): Promise<NodeTree>
  async findSimilarNodes(nodeId: string): Promise<SimilarityMatch[]>
  
  // Cost management
  async estimateCost(operation: string, parameters: any): Promise<number>
  trackSpending(actualCost: number): void
  canMakeRequest(estimatedCost: number): boolean
}
```

### Error Handling
- **Network Failures**: Graceful fallback with user notification
- **API Limits**: Queue requests when rate limited
- **Invalid Responses**: Fallback to cached or default responses
- **Cost Overruns**: Block requests when budget exceeded
- **Timeout Handling**: Cancel long-running requests appropriately

### User Experience Integration
- **Loading States**: Show progress during AI operations
- **Cost Transparency**: Display estimated costs before operations
- **Cancellation**: Allow users to cancel in-progress requests
- **Feedback Collection**: Learn from user acceptance/rejection of suggestions
- **Offline Handling**: Clear messaging when AI features unavailable

## Specific Feature Guidelines

### Rabbit Hole Mode
- **Suggestion Count**: Always generate exactly 3 suggestions
- **Progress Feedback**: 2-second long-press with circular progress
- **Mode Toggle**: Abstract vs Detailed content generation
- **Acceptance Workflow**: Individual accept/reject for each suggestion
- **Node Creation**: Automatically create accepted suggestions as child nodes

### Smart Convert (Text-to-Nodes)
- **Text Processing**: Break text into logical node hierarchy
- **Preview Required**: Always show preview before final acceptance
- **Individual Control**: Allow editing of each generated node
- **Taxonomy Assignment**: Auto-suggest taxonomy for each node
- **Depth Calculation**: Assign appropriate depths based on content hierarchy

### Cross-Depth Similarity
- **User-Triggered**: Only run when explicitly requested
- **Similarity Threshold**: Use reasonable threshold for meaningful matches
- **Explanation Required**: Provide reasoning for detected similarities
- **Match Types**: Support exact topic, manual links, and duplicate detection
- **Performance Limits**: Limit analysis scope for large graphs

### Taxonomy Auto-Suggestion
- **Topic-Only Input**: Use only node topic, not full content (cost optimization)
- **Confidence Scoring**: Provide confidence levels for suggestions
- **User Override**: Always allow manual taxonomy selection
- **Learning**: Improve suggestions based on user corrections
- **Fallback**: Default to 'concept' if uncertain

## Quality Assurance

### Testing Requirements
- **Mock AI Responses**: Use consistent test data for development
- **Cost Calculation Tests**: Verify accurate cost estimation
- **Cache Behavior Tests**: Validate cache hit/miss scenarios
- **Error Scenario Tests**: Test all failure modes
- **Performance Tests**: Measure response times and resource usage

### Monitoring and Analytics
- **Usage Tracking**: Monitor which AI features are most used
- **Cost Analysis**: Track actual vs estimated costs
- **Performance Metrics**: Measure AI response times
- **Error Rates**: Monitor and alert on high failure rates
- **User Satisfaction**: Track acceptance rates for AI suggestions

### Continuous Improvement
- **Prompt Optimization**: Regularly review and improve prompts
- **Cost Efficiency**: Identify opportunities for cost reduction
- **Feature Usage**: Analyze which AI features provide most value
- **User Feedback**: Incorporate user suggestions for AI improvements
- **Technology Updates**: Stay current with OpenAI API improvements