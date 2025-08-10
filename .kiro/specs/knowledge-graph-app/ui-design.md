# UI/UX Design Specifications

## Overview
User interface and interaction design patterns for the Knowledge Graph App, optimized for mobile-first experience across three distinct modes.

## Core Design Principles
- **Mobile-First**: Touch-optimized interactions for fragmented learning time
- **Mode Clarity**: Clear visual distinction between Bolt, Standard, and Rabbit Hole modes
- **Minimal Friction**: Reduce cognitive load for quick idea capture and organization
- **Visual Hierarchy**: Depth and taxonomy relationships clearly represented

## Mode-Specific UI Patterns

### Bolt Mode Interface
**Purpose**: Lightning-fast idea capture
**Layout**:
- Full-screen text input with minimal chrome
- Auto-expanding text area
- Quick save indicator (visual feedback)
- Subtle mode indicator

**Interactions**:
- Immediate focus on text input
- Swipe gestures for quick save/dismiss
- Background auto-save with visual confirmation

### Standard Mode Interface
**Purpose**: Structured mind mapping and organization
**Layout**:
- Interactive force-directed graph visualization
- Node editing panel (slide-up/modal)
- File/map navigation drawer
- Taxonomy and depth controls

**Key UI Components**:
- **Node Representation**: Visual indicators for taxonomy categories and depth levels
- **Connection Visualization**: Distinct visual styles for cross-file vs same-file connections
- **Editing Interface**: Node content editor with taxonomy selector and depth configuration
- **Map Dashboard**: Recent activity overview across multiple knowledge maps

### Rabbit Hole Mode Interface
**Purpose**: AI-guided exploration and discovery
**Layout**:
- Selected node highlighted in center
- AI suggestion cards around periphery
- Mode toggle (Abstract vs Detailed)
- Accept/reject controls for suggestions

**Interaction Flow**:
- Tap node → Enter Rabbit Hole Mode
- Choose output mode (Abstract/Detailed)
- Review AI suggestions
- Accept → Create connected nodes
- Option for sibling vs child node creation

## Touch Interaction Patterns

### Graph Manipulation
- **Pinch Zoom**: Smooth zooming with momentum and bounds
- **Pan**: Drag to navigate large graphs
- **Node Selection**: Single tap to select, double tap to edit
- **Node Creation**: Long press on empty space
- **Node Dragging**: Real-time position updates with smooth animations

### Gesture Navigation
- **Mode Switching**: Swipe patterns or tab navigation
- **File Navigation**: Swipe between knowledge maps
- **Context Actions**: Long press for context menus
- **Quick Actions**: Swipe gestures on nodes for common operations

### Mobile Optimization
- **Touch Targets**: Minimum 44px touch targets for accessibility
- **Thumb Zones**: Critical actions within comfortable thumb reach
- **Visual Feedback**: Clear pressed states and loading indicators
- **Error Prevention**: Confirmation for destructive actions

## Visual Design System

### Node Visualization
- **Taxonomy Indicators**: Color coding or icon system for 5 categories
- **Depth Representation**: Size, opacity, or border thickness variations
- **Connection Types**: Different line styles for various relationship types
- **State Indicators**: Selected, editing, AI-suggested states

### Cross-File Connections
- **Visual Distinction**: Dashed lines, different colors, or special indicators
- **Context Information**: Tooltips or labels showing source file
- **Navigation**: Tap to jump to connected file/node

### Responsive Layouts
- **Portrait Mode**: Optimized for one-handed use
- **Landscape Mode**: Wider graph view, side panels
- **Different Screen Sizes**: Adaptive layouts for various mobile devices

## Accessibility Considerations
- **Screen Reader Support**: Proper labeling for graph elements
- **High Contrast**: Alternative color schemes
- **Font Scaling**: Respect system font size preferences
- **Motor Accessibility**: Alternative input methods for complex gestures

## Animation and Transitions
- **Graph Layout**: Smooth force-directed animations
- **Mode Transitions**: Clear visual transitions between modes
- **Node Creation**: Satisfying creation animations
- **Loading States**: Progressive disclosure and skeleton screens