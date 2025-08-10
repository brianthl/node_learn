# UI/UX Design Specifications

## Overview
User interface and interaction design patterns for the Knowledge Graph App, featuring electron shell depth visualization and graph-centric interaction model.

## Core Design Principles
- **Graph-Centric Interface**: Most interactions happen within the graph view
- **Electron Shell Visualization**: Nodes constrained to depth-based circular rings
- **Selection-Based Editing**: Click to select, click again to edit workflow
- **Contextual Toolbars**: Bottom toolbar changes based on selection state
- **Progressive Disclosure**: Features revealed through selection and long-press gestures

## App Structure & Navigation

### Main Navigation
- **First Launch**: Main page with 3 large mode buttons (Bolt | Standard | Rabbit Hole)
- **Subsequent Launches**: Cache and return to last used mode
- **Mode Switching**: Hamburger menu (top-left) when not on main page
- **Knowledge Map Switching**: Left sidebar with file/map selector (same hamburger menu)

## Mode-Specific UI Patterns

### Bolt Mode Interface
**Purpose**: Quick idea capture with two input methods

**Entry Options**:
- **Smart Convert**: Paste text directly → AI converts to node tree → Show preview → Accept/Reject
- **Bolt Graph**: Manual node tree creation (same as Standard Mode but stored in bolt folder)

**Layout**:
- Two large option buttons on entry
- **Smart Convert**: Text input area with paste functionality, preview panel, conversion controls
- **Bolt Graph**: Standard graph interface with bolt folder indicator
- **Voice Input**: Always visible button for audio capture

**Interactions**:
- Direct text paste for Smart Convert
- Preview-first AI conversion workflow
- Standard graph interactions for Bolt Graph mode

### Standard Mode Interface
**Purpose**: Structured mind mapping with electron shell visualization

**Graph Visualization**:
- **Electron Shell Layout**: Concentric circular rings for each depth level
  - Depth 0 (center): Root nodes
  - Depth 1: First ring (red area)
  - Depth 2: Second ring (blue area)
  - Depth 3+: Additional rings with distinct colors
- **Node Constraints**: Nodes locked to their depth ring, cannot be dragged outside
- **Node Colors**: Determined by taxonomy category (Concept, Process, Component, Cause, Context, Complementary)
- **Node Labels**: Only topic text visible beside nodes

**Selection System**:
- **Click to Select**: Node centers on screen, highlights, shows add child buttons (left/right)
- **Selection Lock**: View locked while node selected, pan/zoom disabled
- **Click Again**: Enter edit mode (topic/taxonomy/depth at top, content below)
- **Deselection**: Click empty space to deselect and unlock view

**Bottom Toolbar (Context-Sensitive)**:
- **No Selection**: Add Node | Import Bolt | Search | Map Settings
- **Node Selected**: Add Child | Edit | Delete | Copy | Show Related

### Rabbit Hole Mode Interface
**Purpose**: AI-powered node expansion and exploration

**Mode Activation**:
- **Entry Points**: Main page mode selection OR toggle switch (top-right corner) in any graph view
- **Visual Indicator**: Rabbit hole toggle switch visible when active

**AI Generation Flow**:
1. **Long-Press Node**: 2-second hold with circular progress bar around node edge
2. **Progress Feedback**: Progress circle fills during 2-second hold
3. **Suggestion Display**: Bottom sheet slides up with 3 AI-generated suggestions
4. **Suggestion Cards**: Each card shows topic, content preview, Accept/Reject buttons
5. **Node Creation**: Accept creates child node connected to selected parent

**Bottom Sheet Layout**:
- **Header**: "AI Suggestions for [Node Topic]"
- **Mode Toggle**: Abstract vs Detailed content generation
- **Suggestion Cards**: 3 cards with topic, description, taxonomy indicator
- **Actions**: Individual Accept/Reject buttons per suggestion
- **Dismiss**: Swipe down or tap outside to close

## Touch Interaction Patterns

### Core Gesture Vocabulary
- **Single Tap Node**: Select node (center, highlight, show child buttons)
- **Double Tap Node**: Enter edit mode (topic/taxonomy/depth + content)
- **Long Press Node**: Activate AI suggestions (2-second hold with progress circle)
- **Long Press Empty Space**: Create new root node (context menu)
- **Tap Empty Space**: Deselect current node, unlock view
- **Pinch/Zoom**: Navigate graph (only when no node selected)
- **Pan/Drag**: Navigate graph (only when no node selected)

### Node Manipulation
- **Add Child Buttons**: Appear left/right of selected node
- **Node Dragging**: Constrained to depth ring boundaries
- **Node Positioning**: Automatic layout within depth constraints
- **Cross-Ring Movement**: Only via depth level changes in edit mode

### Navigation Gestures
- **Hamburger Menu**: Access mode switching and map selection
- **Bottom Toolbar**: Context-sensitive tools based on selection state
- **Sidebar Swipe**: Quick access to knowledge map list
- **Bottom Sheet**: Swipe up for AI suggestions, swipe down to dismiss

### Mobile Optimization
- **Touch Targets**: Minimum 44px touch targets for accessibility
- **Thumb Zones**: Critical actions within comfortable thumb reach
- **Visual Feedback**: Clear pressed states and loading indicators
- **Error Prevention**: Confirmation for destructive actions

## Visual Design System

### Electron Shell Visualization
- **Depth Rings**: Concentric circles with distinct background colors
  - Depth 0: Center area (root nodes)
  - Depth 1: Red ring
  - Depth 2: Blue ring  
  - Depth 3+: Additional color progression
- **Ring Constraints**: Nodes cannot be positioned outside their depth ring
- **Ring Boundaries**: Subtle visual boundaries between depth levels

### Node Visualization
- **Taxonomy Colors**: Node background colors based on category
  - Concept: Light blue
  - Process: Green
  - Component: Orange
  - Cause: Red
  - Context: Purple
  - Complementary: Yellow
- **Selection State**: Highlighted border, centered position, child buttons visible
- **Edit State**: Modal overlay with topic/taxonomy/depth fields + content area
- **AI State**: Progress circle during long-press, suggestion connections

### Connection Visualization
- **Parent-Child**: Solid lines connecting nodes across depth rings
- **Cross-File**: Dashed lines with different color
- **AI-Suggested**: Dotted lines until accepted
- **Manual Links**: Distinct line style for user-created connections

### Responsive Layouts
- **Portrait Mode**: Optimized for one-handed use
- **Landscape Mode**: Wider graph view, side panels
- **Different Screen Sizes**: Adaptive layouts for various mobile devices

## Accessibility Considerations
- **Screen Reader Support**: Proper labeling for graph elements
- **High Contrast**: Alternative color schemes
- **Font Scaling**: Respect system font size preferences
- **Motor Accessibility**: Alternative input methods for complex gestures

## Edit Mode Interface

### Node Edit Modal
**Layout**:
- **Top Section**: Topic field, Taxonomy selector, Depth selector (horizontal layout)
- **Main Section**: Content text area with @local tag support
- **Bottom Section**: Save/Cancel buttons, Delete option

**Taxonomy Selector**:
- Horizontal scrollable pills: Concept | Process | Component | Cause | Context | Complementary
- Current selection highlighted
- Color preview matching node colors

**Depth Selector**:
- Number picker or slider (0-10)
- Visual preview showing which ring the node will appear in
- Validation to prevent depth conflicts with parent/children

### Smart Convert Preview
**Layout**:
- **Input Section**: Large text paste area
- **Preview Section**: Generated node tree visualization
- **Controls**: Accept All | Reject All | Individual node Accept/Reject
- **Refinement**: Edit individual nodes before final acceptance

## Animation and Transitions
- **Node Selection**: Smooth center animation with scale effect
- **Depth Ring Transitions**: Nodes animate between rings when depth changes
- **AI Progress**: Circular progress animation during long-press
- **Bottom Sheet**: Slide up/down animations for AI suggestions
- **Mode Transitions**: Fade transitions between different modes
- **Loading States**: Skeleton screens for AI processing