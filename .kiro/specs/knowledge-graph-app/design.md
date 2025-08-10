# Technical Design Document

## Overview
Comprehensive technical architecture for the Knowledge Graph App, implementing offline-first mobile architecture with AI-powered knowledge discovery. This document details the system components, data flow, and integration patterns based on the user journey and interaction requirements.

## System Architecture

### Frontend Architecture (React Native + Expo)
```
┌─────────────────────────────────────────┐
│              React Native App           │
├─────────────────────────────────────────┤
│  Mode Controllers                       │
│  ├── BoltModeController                 │
│  ├── StandardModeController             │
│  └── RabbitHoleModeController           │
├─────────────────────────────────────────┤
│  Core Services                          │
│  ├── GraphService (node/edge management)│
│  ├── SyncService (offline/online sync)  │
│  ├── AIService (OpenAI integration)     │
│  └── StorageService (WatermelonDB)      │
├─────────────────────────────────────────┤
│  Data Layer                             │
│  ├── WatermelonDB (Local SQLite)        │
│  ├── Sync Queue (Pending operations)    │
│  └── Cache Layer (AI responses)         │
└─────────────────────────────────────────┘
```

### Backend Architecture (Supabase + Vercel)
```
┌─────────────────────────────────────────┐
│           Supabase Backend              │
├─────────────────────────────────────────┤
│  Authentication & User Management       │
├─────────────────────────────────────────┤
│  PostgreSQL Database                    │
│  ├── users, knowledge_maps              │
│  ├── nodes, edges, taxonomies           │
│  └── sync_logs, ai_cache                │
├─────────────────────────────────────────┤
│  Real-time Subscriptions                │
│  └── Sync conflict notifications        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Vercel Serverless APIs          │
├─────────────────────────────────────────┤
│  AI Processing Endpoints                │
│  ├── /api/ai/rabbit-hole                │
│  ├── /api/ai/node-analysis              │
│  ├── /api/ai/similarity-detection       │
│  └── /api/ai/content-generation         │
└─────────────────────────────────────────┘
```

## Core Data Models

### Node Schema
```typescript
interface Node {
  id: string;
  topic: string; // Node title/subject
  content: string; // Detailed node content with @local tag support
  global_content: string; // Content visible across all instances
  local_content_map: Record<string, string>; // tree_id -> local content
  taxonomy: 'concept' | 'process' | 'component' | 'cause' | 'context' | 'complementary';
  suggested_taxonomy?: string; // AI-suggested taxonomy based on topic
  depth: number; // 0-10, relative to knowledge map root
  knowledge_map_id: string;
  parent_id?: string; // null for root nodes
  is_bolt_entry: boolean; // true if created in Bolt Mode
  position_x?: number; // For graph layout persistence
  position_y?: number;
  created_at: timestamp;
  updated_at: timestamp;
  sync_status: 'synced' | 'pending' | 'conflict';
}
```

### Node Linkage Schema
```typescript
interface NodeLink {
  id: string;
  source_node_id: string;
  target_node_id: string;
  link_type: 'exact_topic_match' | 'manual_link' | 'duplicate_node';
  created_by_user: boolean;
  created_at: timestamp;
}

interface RelatedTopicMatch {
  node_id: string;
  knowledge_map_id: string;
  knowledge_map_name: string;
  match_type: 'exact_topic' | 'manual_link' | 'duplicate';
  topic: string;
  content_preview: string;
}
```

### Edge Schema
```typescript
interface Edge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: 'parent_child' | 'cross_file' | 'ai_suggested' | 'manual';
  knowledge_map_id: string;
  created_at: timestamp;
}
```

### Knowledge Map Schema
```typescript
interface KnowledgeMap {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  root_node_ids: string[]; // Multiple root nodes possible
  is_bolt_folder: boolean; // true for bolt storage area
  created_at: timestamp;
  last_accessed: timestamp;
  node_count: number; // For performance optimization
}
```

### Bolt Entry Schema
```typescript
interface BoltEntry {
  id: string;
  root_node_id: string; // Points to the root of the bolt tree
  user_id: string;
  created_at: timestamp;
  imported_to_map_id?: string; // null if not yet imported
  import_date?: timestamp;
}
```

## Component Architecture

### Mode Controllers

#### BoltModeController
```typescript
class BoltModeController {
  // Quick node creation with topic + content
  createBoltEntry(topic: string, content: string): Promise<BoltEntry>
  
  // Auto-save functionality
  autoSave(nodeId: string, data: Partial<Node>): void
  
  // Queue for offline sync
  queueForSync(operation: SyncOperation): void
}
```

#### StandardModeController  
```typescript
class StandardModeController {
  // Knowledge map management
  createKnowledgeMap(name: string): Promise<KnowledgeMap>
  loadKnowledgeMap(mapId: string): Promise<KnowledgeMap>
  
  // Node operations
  createNode(parentId: string, taxonomy: TaxonomyType): Promise<Node>
  updateNode(nodeId: string, updates: Partial<Node>): Promise<Node>
  deleteNode(nodeId: string): Promise<void>
  
  // Bolt entry import (entire connected tree)
  importBoltTree(boltEntryId: string, targetMapId: string): Promise<Node>
  
  // Text-to-node conversion
  importTextFile(textContent: string, targetMapId: string): Promise<Node>
  
  // Cross-map operations
  cloneNodeTree(nodeId: string, targetMapId: string): Promise<Node>
  moveNodeTree(nodeId: string, targetMapId: string): Promise<void>
  
  // Node linkage system
  showRelatedTopics(nodeId: string): Promise<RelatedTopicMatch[]>
  createManualLink(sourceNodeId: string, targetNodeId: string): Promise<void>
}
```

#### RabbitHoleModeController
```typescript
class RabbitHoleModeController {
  // Global mode toggle
  enableRabbitHoleMode(): void
  disableRabbitHoleMode(): void
  
  // Node-specific AI generation (triggered by long-press)
  generateChildSuggestions(nodeId: string, mode: 'abstract' | 'detailed'): Promise<AISuggestion[]>
  
  // Accept AI suggestions and create nodes
  acceptSuggestion(suggestion: AISuggestion, parentNodeId: string): Promise<Node>
  
  // Cross-depth similarity detection (user-triggered)
  findSimilarNodes(nodeId: string): Promise<SimilarityMatch[]>
}
```

### Core Services

#### GraphService
```typescript
class GraphService {
  // Tree structure management
  getNodeChildren(nodeId: string): Promise<Node[]>
  getNodeAncestors(nodeId: string): Promise<Node[]>
  calculateNodeDepth(nodeId: string, rootId: string): number
  
  // Relationship management
  createEdge(sourceId: string, targetId: string, type: EdgeType): Promise<Edge>
  deleteEdge(edgeId: string): Promise<void>
  
  // Graph traversal and analysis
  findShortestPath(fromId: string, toId: string): Promise<Node[]>
  detectCycles(): Promise<Edge[]>
  
  // Complementary node handling
  createComplementaryNode(parentId: string, nodeData: Partial<Node>): Promise<Node>
}
```

## Data Flow Architecture

### Bolt Mode Flow
```
User Input (Topic + Content) 
    ↓
BoltModeController.createBoltEntry()
    ↓
StorageService.saveNode() (local SQLite)
    ↓
SyncService.queueOperation() (for cloud sync)
    ↓
UI Update (visual confirmation)
```

### Standard Mode Import Flow
```
User selects Bolt Entry
    ↓
StandardModeController.importBoltEntry()
    ↓
GraphService.cloneNodeTree() (bolt → standard map)
    ↓
Update BoltEntry.imported_to_map_id
    ↓
Render in force-directed graph
```

### AI Suggestion Flow
```
User clicks AI toggle on Node
    ↓
RabbitHoleModeController.generateChildSuggestions()
    ↓
AIService.callOpenAI() (with taxonomy-specific prompt)
    ↓
Cache response in local SQLite
    ↓
Display suggestions as connected nodes
    ↓
User accepts → GraphService.createNode() + createEdge()
```

## Critical API Contracts

### AI Service Endpoints

#### AI Child Node Generation
```typescript
POST /api/ai/generate-children
Request: {
  parent_node: {
    id: string;
    topic: string;
    content: string;
    taxonomy: TaxonomyType;
    depth: number;
  };
  mode: 'abstract' | 'detailed';
  count: number; // default 3
}
Response: {
  suggestions: Array<{
    topic: string;
    content: string; // empty for abstract mode
    taxonomy: TaxonomyType;
    suggested_depth: number; // parent_depth + 1
    reasoning: string; // why this suggestion fits
  }>;
  cost: number;
  cached: boolean;
}
```

#### Text-to-Node Conversion
```typescript
POST /api/ai/text-to-nodes
Request: {
  text_content: string;
  target_map_id: string;
}
Response: {
  root_node: {
    topic: string;
    content: string;
    taxonomy: TaxonomyType;
  };
  child_nodes: Array<{
    topic: string;
    content: string;
    taxonomy: TaxonomyType;
    depth: number;
    parent_topic: string;
  }>;
  cost: number;
}
```

#### Taxonomy Auto-Suggestion
```typescript
POST /api/ai/suggest-taxonomy
Request: {
  topic: string; // Only topic, not content to save tokens
}
Response: {
  suggested_taxonomy: TaxonomyType;
  confidence: number; // 0-1
  reasoning: string;
  cost: number;
}
```

#### Node Analysis & Improvement
```typescript
POST /api/ai/node-analysis
Request: {
  node_id: string;
  analysis_type: 'proofread' | 'suggestions' | 'expansion';
}
Response: {
  feedback: string;
  improvement_areas: string[];
  expansion_suggestions: string[];
  cost: number;
}
```

#### Similarity Detection (User-Triggered)
```typescript
POST /api/ai/similarity-detection
Request: {
  knowledge_map_id: string;
  node_ids?: string[]; // optional, analyze specific nodes
}
Response: {
  potential_connections: Array<{
    node_a_id: string;
    node_b_id: string;
    similarity_score: number;
    explanation: string;
  }>;
  total_cost: number;
}
```

### Sync Service Architecture

#### Offline-First Strategy
1. **Local Operations**: All CRUD operations happen on WatermelonDB first
2. **Sync Queue**: Changes queued with operation type and timestamp
3. **Batch Upload**: Periodic sync of queued operations to Supabase
4. **Conflict Resolution**: Server-side conflict detection with user resolution options
5. **Delta Sync**: Only sync changed data, not full datasets

#### Sync Operation Flow
```typescript
interface SyncOperation {
  id: string;
  operation_type: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  data: any;
  timestamp: number;
  retry_count: number;
}
```

## AI Integration Patterns

### Cost Optimization Strategy
- **Caching Layer**: SQLite table for AI responses with TTL
- **Batch Processing**: Group similar requests to minimize API calls
- **User-Triggered Only**: No automatic AI processing
- **Fixed Pricing**: Predictable cost per analysis session

### Node Management Endpoints

#### Cross-Map Operations
```typescript
POST /api/nodes/clone-tree
Request: {
  source_node_id: string;
  target_map_id: string;
  include_children: boolean;
}
Response: {
  cloned_root_id: string;
  cloned_node_count: number;
}

POST /api/nodes/move-tree  
Request: {
  source_node_id: string;
  target_map_id: string;
  operation: 'move' | 'copy' | 'copy_with_children';
}
Response: {
  new_node_id: string;
  affected_nodes: string[];
}
```

#### Bolt Entry Management
```typescript
GET /api/bolt-entries
Response: {
  entries: Array<{
    id: string;
    root_node: Node;
    node_count: number; // Total nodes in tree
    created_at: timestamp;
    imported: boolean;
  }>;
}

POST /api/bolt-entries/import-tree
Request: {
  bolt_entry_id: string;
  target_map_id: string;
}
Response: {
  imported_root_id: string;
  imported_node_count: number;
  success: boolean;
}
```

#### Node Linkage System
```typescript
GET /api/nodes/:nodeId/related-topics
Response: {
  matches: Array<RelatedTopicMatch>;
  total_count: number;
}

POST /api/nodes/create-manual-link
Request: {
  source_node_id: string;
  target_node_id: string;
}
Response: {
  link_id: string;
  success: boolean;
}
```

### AI Integration Patterns

#### Taxonomy-Specific Prompts
```typescript
const TAXONOMY_PROMPTS = {
  concept: "For the concept '{topic}', suggest 3 child concepts that define or categorize it. Context: {content}",
  process: "For the process '{topic}', suggest 3 sub-processes or steps. Context: {content}",
  component: "For '{topic}', suggest 3 key components or parts. Context: {content}",
  cause: "For '{topic}', suggest 3 causes, effects, or related causal factors. Context: {content}",
  context: "For '{topic}', suggest 3 contextual factors or background elements. Context: {content}",
  complementary: "For '{topic}', suggest 3 complementary or related concepts at the same level. Context: {content}"
};

const TAXONOMY_SUGGESTION_PROMPT = "Based on the topic '{topic}', what taxonomy category best fits: concept, process, component, cause, context, or complementary? Respond with just the category name.";

const TEXT_TO_NODES_PROMPT = `
Convert this text into a structured knowledge graph:
"{text_content}"

Create a root node with the main topic, then break down the content into 3-5 child nodes. 
For each node, provide:
- topic: concise title
- content: relevant content from the text
- taxonomy: concept/process/component/cause/context/complementary
- depth: 0 for root, 1 for children

Respond in JSON format.
`;
```

#### AI Response Caching Strategy
```typescript
interface AICache {
  id: string;
  request_hash: string; // MD5 of request parameters
  response_data: any;
  created_at: timestamp;
  expires_at: timestamp;
  usage_count: number;
}

// Cache key generation
function generateCacheKey(nodeId: string, mode: string, taxonomy: string): string {
  return md5(`${nodeId}-${mode}-${taxonomy}`);
}
```

## Security & Authentication
- **Supabase Auth**: Handle user authentication and session management
- **Row Level Security**: Database-level access control for user data
- **API Rate Limiting**: Prevent abuse of AI endpoints
- **Data Encryption**: Encrypt sensitive data at rest and in transit

## Error Handling Strategy
- **Graceful Degradation**: App functions offline when sync fails
- **Retry Logic**: Exponential backoff for failed operations
- **User Feedback**: Clear error messages and recovery options
- **Data Recovery**: Backup and restore capabilities for data corruption

## Error Handling & Edge Cases

### Node Depth Management
```typescript
class DepthValidator {
  // Ensure depth consistency in tree
  validateDepthAssignment(nodeId: string, newDepth: number): boolean {
    const parent = this.getParent(nodeId);
    const children = this.getChildren(nodeId);
    
    // Parent must have lower depth
    if (parent && parent.depth >= newDepth) return false;
    
    // Children must have higher depth  
    if (children.some(child => child.depth <= newDepth)) return false;
    
    return true;
  }
  
  // Auto-correct depth inconsistencies
  recalculateTreeDepths(rootId: string): void {
    this.traverseDepthFirst(rootId, (node, depth) => {
      node.depth = depth;
    });
  }
}
```

### Complementary Node Logic
```typescript
class ComplementaryNodeHandler {
  createComplementaryNode(parentId: string, nodeData: Partial<Node>): Promise<Node> {
    const parent = await this.getNode(parentId);
    
    const complementaryNode = {
      ...nodeData,
      depth: parent.depth, // Same depth as parent
      taxonomy: 'complementary',
      parent_id: parentId // Connected TO parent, not sibling
    };
    
    return this.createNode(complementaryNode);
  }
}
```

### Local Tag Processing
```typescript
class LocalTagProcessor {
  parseLocalTags(content: string, treeId: string): { global: string; local: string } {
    const localTagRegex = /@local(.*?)@local/gs;
    let localContent = '';
    let globalContent = content;
    
    // Extract @local sections
    const matches = content.matchAll(localTagRegex);
    for (const match of matches) {
      localContent += match[1];
      globalContent = globalContent.replace(match[0], ''); // Remove from global
    }
    
    return { global: globalContent.trim(), local: localContent.trim() };
  }
  
  renderContentForTree(node: Node, currentTreeId: string): string {
    const localContent = node.local_content_map[currentTreeId] || '';
    return node.global_content + (localContent ? '\n\n' + localContent : '');
  }
}

### Node Linkage System
```typescript
class NodeLinkageService {
  findRelatedTopics(nodeId: string): Promise<RelatedTopicMatch[]> {
    const node = await this.getNode(nodeId);
    const matches: RelatedTopicMatch[] = [];
    
    // 1. Exact topic name matching
    const exactMatches = await this.findNodesByTopic(node.topic);
    matches.push(...exactMatches.map(n => ({
      node_id: n.id,
      knowledge_map_id: n.knowledge_map_id,
      knowledge_map_name: n.knowledge_map_name,
      match_type: 'exact_topic',
      topic: n.topic,
      content_preview: n.content.substring(0, 100)
    })));
    
    // 2. Manual user-created links
    const manualLinks = await this.getManualLinks(nodeId);
    matches.push(...manualLinks);
    
    // 3. Duplicate nodes (copy/paste)
    const duplicates = await this.findDuplicateNodes(nodeId);
    matches.push(...duplicates);
    
    return matches;
  }
}

### Sync Conflict Resolution
```typescript
interface ConflictResolution {
  conflict_id: string;
  local_version: Node;
  remote_version: Node;
  resolution_strategy: 'keep_local' | 'keep_remote' | 'merge' | 'manual';
  resolved_version?: Node;
}

class SyncConflictResolver {
  detectConflicts(localNodes: Node[], remoteNodes: Node[]): ConflictResolution[] {
    // Compare timestamps and content hashes
    // Special handling for local_content_map conflicts
    // Return conflicts requiring user resolution
  }
  
  autoResolveConflicts(conflicts: ConflictResolution[]): ConflictResolution[] {
    // Apply automatic resolution rules
    // Merge local_content_maps when possible
    // Return remaining conflicts needing manual resolution
  }
}
```

## Performance Optimization Strategies

### Graph Rendering Optimization
```typescript
class GraphRenderer {
  // Implement node virtualization for large graphs
  renderVisibleNodes(viewport: Viewport, allNodes: Node[]): Node[] {
    return allNodes.filter(node => this.isInViewport(node, viewport));
  }
  
  // Progressive loading for large knowledge maps
  loadNodesInBatches(mapId: string, batchSize: number = 50): AsyncGenerator<Node[]> {
    // Yield nodes in batches to prevent UI blocking
  }
  
  // Simplify graph layout for performance
  simplifyLayoutForLargeGraphs(nodeCount: number): LayoutConfig {
    if (nodeCount > 500) {
      return { 
        algorithm: 'hierarchical', 
        animationDuration: 0,
        nodeSpacing: 'compact'
      };
    }
    return { algorithm: 'force-directed', animationDuration: 300 };
  }
}
```

### AI Cost Management
```typescript
class AIBudgetManager {
  private dailyBudget: number = 5.00; // $5 per day
  private currentSpend: number = 0;
  
  canMakeRequest(estimatedCost: number): boolean {
    return (this.currentSpend + estimatedCost) <= this.dailyBudget;
  }
  
  trackSpending(actualCost: number): void {
    this.currentSpend += actualCost;
    this.persistSpendingData();
  }
  
  getBudgetStatus(): { remaining: number; percentage: number } {
    const remaining = this.dailyBudget - this.currentSpend;
    const percentage = (this.currentSpend / this.dailyBudget) * 100;
    return { remaining, percentage };
  }
}
```

## Technology Stack Integration
- **React Native + Expo**: Cross-platform mobile development with OTA updates
- **WatermelonDB**: Offline-first local database with automatic sync capabilities  
- **Supabase**: Backend-as-a-Service for auth, PostgreSQL database, and real-time subscriptions
- **Vercel**: Serverless functions for AI processing and cost-optimized API endpoints
- **OpenAI GPT-3.5-turbo**: AI content generation with taxonomy-specific prompting
- **React Native Reanimated 3**: Smooth 60fps animations for graph interactions
- **React Force Graph**: Interactive force-directed graph visualization
- **Zustand**: Lightweight state management for app-wide state