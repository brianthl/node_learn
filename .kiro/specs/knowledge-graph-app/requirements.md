# Requirements Document

## Introduction

The Knowledge Graph App is a mobile application that transforms fragmented learning time into active knowledge building through depth-aware mind mapping and AI-assisted discovery. Unlike traditional note-taking apps like Obsidian, this app introduces a unique depth-based node system where nodes at different hierarchical levels can form intelligent cross-connections that users might overlook. The app provides three distinct modes: Bolt Mode for lightning-fast idea capture, Standard Mode for structured cross-file mind mapping, and Rabbit Hole Mode for AI-guided topic exploration. The application aims to replace mindless scrolling with productive knowledge discovery during fragmented time, featuring lightweight mobile-first design with offline capabilities.

## Concept Rating & Validation

**Idea Strength: 8.5/10** - The depth-based knowledge linking with AI-powered cross-depth analysis is a unique differentiator that addresses real gaps in existing knowledge management tools. The three-mode approach effectively covers different learning contexts for mobile-first fragmented learning time.

## Requirements

### Requirement 1

**User Story:** As a learner, I want to quickly capture ideas and thoughts without friction, so that I can preserve insights during brief moments of inspiration and organize them later.

#### Acceptance Criteria

1. WHEN the user opens Bolt Mode THEN the system SHALL present a quick input interface within 2 seconds
2. WHEN the user enters text in Bolt Mode THEN the system SHALL save the entry without requiring taxonomy or depth assignment
3. WHEN the user saves a bolt entry THEN the system SHALL queue it for cloud synchronization without blocking the UI
4. WHEN the user wants to organize bolt entries THEN the system SHALL allow manual transfer to Standard Mode for proper structuring
5. WHEN the user is offline THEN the system SHALL store bolt entries locally and sync when connection is restored

### Requirement 2

**User Story:** As a knowledge worker, I want to create structured mind maps with interconnected nodes, so that I can organize complex information hierarchically.

#### Acceptance Criteria

1. WHEN the user creates a new node THEN the system SHALL allow assignment of parent-child relationships
2. WHEN the user links nodes from different files THEN the system SHALL maintain cross-file references and display them visually
3. WHEN the user views a mind map THEN the system SHALL render an interactive force-directed graph visualization
4. WHEN the user edits a node THEN the system SHALL update all related connections in real-time
5. IF a node has cross-file connections THEN the system SHALL highlight these relationships with distinct visual indicators

### Requirement 3

**User Story:** As a curious learner, I want AI-powered suggestions for expanding my knowledge graphs in Rabbit Hole Mode, so that I can explore topics systematically and discover new knowledge paths.

#### Acceptance Criteria

1. WHEN the user activates Rabbit Hole Mode on a node THEN the system SHALL generate 2-4 relevant child node suggestions based on the node's taxonomy category
2. WHEN the user selects Abstract Mode THEN the system SHALL output node topics with guiding abstracts (e.g., "WW2" → "Causes (explore political tensions)", "Timeline (key dates and phases)")
3. WHEN the user selects Detailed Mode THEN the system SHALL generate full content matching the node's depth level (deeper nodes = more detailed content)
4. WHEN the system generates suggestions THEN it SHALL use taxonomy-specific prompts (Concept: "Define [topic]", Process: "List key stages", etc.)
5. WHEN the user wants complementary nodes at the same depth THEN the system SHALL provide options to create sibling nodes instead of child nodes
6. WHEN the user accepts AI suggestions THEN the system SHALL create new nodes with appropriate taxonomy classification and depth-aware connections
7. IF the user wants to brainstorm first THEN the system SHALL provide Abstract Mode to guide thinking before revealing detailed content

### Requirement 4

**User Story:** As a mobile user, I want seamless offline functionality with reliable cloud synchronization, so that I can work on my knowledge graphs anywhere without data loss.

#### Acceptance Criteria

1. WHEN the user is offline THEN the system SHALL allow full read/write operations using local SQLite storage
2. WHEN the device reconnects to internet THEN the system SHALL automatically sync local changes to Supabase backend
3. WHEN sync conflicts occur THEN the system SHALL detect conflicts and provide resolution options to the user
4. WHEN batch uploading changes THEN the system SHALL process them in background without blocking user interaction
5. IF sync fails THEN the system SHALL retry with exponential backoff and notify user of persistent failures

### Requirement 5

**User Story:** As a user managing multiple knowledge domains, I want to organize and navigate between different knowledge maps efficiently, so that I can maintain separate contexts for different subjects.

#### Acceptance Criteria

1. WHEN the user creates a new knowledge map THEN the system SHALL allow custom naming and categorization
2. WHEN the user switches between maps THEN the system SHALL preserve the current state and load the selected map within 3 seconds
3. WHEN the user searches across maps THEN the system SHALL provide results with map context indicators
4. WHEN the user exports a map THEN the system SHALL generate a shareable file format preserving all node relationships
5. IF the user has multiple maps THEN the system SHALL provide a dashboard view showing recent activity across all maps

### Requirement 6

**User Story:** As a user, I want intuitive mobile interactions for manipulating knowledge graphs, so that I can efficiently work with complex information on small screens.

#### Acceptance Criteria

1. WHEN the user interacts with the graph THEN the system SHALL provide touch-optimized controls for navigation and editing
2. WHEN the user selects nodes THEN the system SHALL provide appropriate editing and connection options
3. WHEN the user creates new nodes THEN the system SHALL offer intuitive placement and linking mechanisms
4. WHEN the user navigates large graphs THEN the system SHALL provide smooth and responsive interaction patterns
5. IF the user performs common actions THEN the system SHALL provide gesture shortcuts for efficiency

*Note: Detailed interaction patterns specified in ui-design.md*

### Requirement 7

**User Story:** As a knowledge organizer, I want to assign taxonomy categories and relative depth levels for nodes, so that I can create tree-structured knowledge hierarchies that enable intelligent analysis and content generation.

#### Acceptance Criteria

1. WHEN the user creates a root node THEN the system SHALL assign depth level 0 and allow taxonomy category selection (Concept, Process, Component, Cause, Context)
2. WHEN the user creates a child node THEN the system SHALL auto-suggest depth = parent_depth + 1 with option for user to configure manually
3. WHEN the user assigns a taxonomy category THEN the system SHALL use category-specific AI prompts (Concept: definitions, Process: step-based explanations, etc.)
4. WHEN the user requests node clash analysis THEN the system SHALL perform user-triggered, on-demand similarity detection using cost-effective methods
5. WHEN node clashes are detected THEN the system SHALL propose potential linkages between different topics as learning opportunities
6. IF the user connects nodes across files THEN the system SHALL maintain taxonomy and relative depth relationships for cross-file analysis

### Requirement 8

**User Story:** As a knowledge creator in Standard Mode, I want AI assistance for improving and expanding my existing nodes, so that I can enhance my notes and discover areas for deeper exploration.

#### Acceptance Criteria

1. WHEN the user requests AI proofreading on a node THEN the system SHALL provide cost-effective feedback on content quality and clarity
2. WHEN the user asks for improvement suggestions THEN the system SHALL identify areas they might have missed based on the node's taxonomy category
3. WHEN the system analyzes a node THEN it SHALL suggest specific aspects the user could dive deeper into
4. WHEN the user receives AI advice THEN the system SHALL provide actionable recommendations that respect the node's current depth level
5. IF the user wants comprehensive analysis THEN the system SHALL offer batch processing options to minimize API costs

### Requirement 9

**User Story:** As a user working with different node types, I want category-optimized AI processing, so that I receive relevant and appropriately formatted content for each taxonomy category.

#### Acceptance Criteria

1. WHEN generating content for Concept nodes THEN the system SHALL prioritize definitions, characteristics, and significance explanations
2. WHEN processing Process nodes THEN the system SHALL produce step-based explanations with sequential flow
3. WHEN handling Component nodes THEN the system SHALL focus on parts, relationships, and structural breakdowns
4. WHEN analyzing Cause nodes THEN the system SHALL emphasize causal relationships, triggers, and effects
5. WHEN working with Context nodes THEN the system SHALL provide background, environment, and situational factors
6. IF a node's category changes THEN the system SHALL re-evaluate existing connections for continued relevance

### Requirement 10

**User Story:** As a user with varying graph sizes, I want consistent performance and cost-effective AI usage, so that the app remains responsive and affordable at scale.

#### Acceptance Criteria

1. WHEN working with large graphs THEN the system SHALL maintain smooth performance through optimization techniques
2. WHEN using AI features THEN the system SHALL provide predictable, user-controlled costs
3. WHEN processing requests THEN the system SHALL prioritize efficiency and avoid unnecessary resource consumption
4. WHEN scaling usage THEN the system SHALL gracefully handle increased data and complexity
5. IF performance degrades THEN the system SHALL implement appropriate fallback strategies

*Note: Specific performance targets and AI cost optimization detailed in performance.md*

### Requirement 11

**User Story:** As a user concerned about data persistence, I want robust data management with backup and recovery capabilities, so that my knowledge graphs are protected against data loss.

#### Acceptance Criteria

1. WHEN the user makes changes THEN the system SHALL automatically save to local storage
2. WHEN the system performs cloud backup THEN it SHALL maintain versioned history of knowledge graphs
3. WHEN the user requests data export THEN the system SHALL provide multiple format options (JSON, markdown, etc.)
4. WHEN data corruption is detected THEN the system SHALL attempt recovery from cloud backup and notify the user
5. IF the user deletes content accidentally THEN the system SHALL provide undo functionality for recent operations

*Note: Technical implementation details specified in design.md*