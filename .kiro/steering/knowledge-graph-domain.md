# Knowledge Graph Domain Knowledge

## Core Concepts

### Node Taxonomy System
Always use these 6 categories with specific purposes:
- **concept**: Fundamental ideas, definitions, theories (e.g., "Democracy", "Neural Networks")
- **process**: Sequences, procedures, workflows (e.g., "Photosynthesis Steps", "User Authentication")
- **component**: Parts, elements, sub-entities (e.g., "Car Engine Parts", "React Components")
- **cause**: Reasons, triggers, influences (e.g., "Causes of Inflation", "Bug Root Causes")
- **context**: Background, environment, conditions (e.g., "Historical Context", "Market Conditions")
- **complementary**: Related concepts at same depth level (e.g., sibling topics, alternatives)

### Depth System Rules
- **Depth 0**: Root nodes only (main topics, starting points)
- **Depth 1-10**: Hierarchical levels where children = parent_depth + 1
- **Depth Constraints**: Children must have higher depth than parents
- **Complementary Nodes**: Same depth as parent but connected TO parent (not sibling)
- **Electron Shell Visualization**: Nodes constrained to circular rings based on depth

### Node Structure
Every node contains:
- **topic**: Concise title/subject (displayed beside node in graph)
- **content**: Detailed information with @local tag support
- **taxonomy**: One of the 6 categories above
- **depth**: 0-10 hierarchical level
- **global_content**: Visible across all instances
- **local_content_map**: Tree-specific content using @local tags

## AI Integration Principles

### Taxonomy-Specific AI Prompts
Each taxonomy category requires different AI approaches:
- **concept**: Focus on definitions, characteristics, significance
- **process**: Emphasize steps, sequences, workflows
- **component**: Highlight parts, relationships, structure
- **cause**: Explain causality, triggers, effects
- **context**: Provide background, environment, conditions
- **complementary**: Suggest related concepts at same level

### Cost Optimization Strategies
- **Cache First**: Always check SQLite cache before API calls
- **User-Triggered Only**: No automatic AI processing
- **Batch Requests**: Group similar operations when possible
- **Topic-Only Suggestions**: Use only node topics (not content) for taxonomy suggestions
- **Fixed Pricing**: Provide predictable cost estimates per operation

### AI Response Patterns
- **Rabbit Hole Mode**: Generate 3 child node suggestions
- **Abstract Mode**: Provide topic + guiding description only
- **Detailed Mode**: Generate full content matching node depth
- **Text-to-Node**: Break text into root + 3-5 connected children
- **Similarity Detection**: User-triggered cross-depth analysis only

## Graph Visualization Principles

### Electron Shell Layout
- **Concentric Rings**: Each depth level gets its own circular area
- **Color Coding**: Depth rings have distinct background colors (depth 1=red, depth 2=blue, etc.)
- **Node Constraints**: Nodes cannot be positioned outside their depth ring
- **Taxonomy Colors**: Node background colors based on category, not depth

### Node Relationships
- **Parent-Child**: Solid lines connecting across depth rings
- **Cross-File**: Dashed lines with different color
- **AI-Suggested**: Dotted lines until user accepts
- **Manual Links**: Distinct style for user-created connections

### Interaction Patterns
- **Selection System**: Click to select/center, click again to edit
- **View Locking**: Graph navigation disabled when node selected
- **Context Sensitivity**: Bottom toolbar changes based on selection state
- **Progressive Disclosure**: Features revealed through selection and gestures

## Data Architecture Patterns

### Offline-First Design
- **Local Authority**: WatermelonDB is source of truth
- **Sync Queue**: Operations queued for cloud synchronization
- **Conflict Resolution**: User-guided resolution for sync conflicts
- **Graceful Degradation**: Full functionality without internet

### Cross-Map Operations
- **Node Cloning**: Simple copy without shared addresses
- **Tree Operations**: Import/export entire connected node trees
- **Linkage System**: Track relationships via exact topic match, manual links, duplicates
- **Local Tags**: @local content @local for tree-specific information

### Performance Considerations
- **Node Virtualization**: Display only visible nodes for large graphs
- **Progressive Loading**: Batch load nodes to prevent UI blocking
- **Layout Simplification**: Switch to hierarchical layout for 500+ nodes
- **Memory Management**: Clean up unused graph data regularly

## User Experience Principles

### Three-Mode Philosophy
- **Bolt Mode**: Lightning-fast capture without organization overhead
- **Standard Mode**: Structured organization with visual graph interface
- **Rabbit Hole Mode**: AI-powered exploration and discovery

### Mobile-First Interactions
- **Touch Optimized**: All interactions designed for finger navigation
- **Gesture Vocabulary**: Consistent gesture meanings across modes
- **Visual Feedback**: Immediate response to all user actions
- **Context Awareness**: Interface adapts to current selection and mode

### Learning Curve Management
- **Progressive Complexity**: Simple features first, advanced features discoverable
- **Visual Metaphors**: Electron shell concept for depth understanding
- **Consistent Patterns**: Same interaction patterns across different contexts
- **Error Prevention**: Validation and constraints prevent invalid states