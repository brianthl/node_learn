import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, TouchableOpacity, Text } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';
import { Node, Edge, TaxonomyType } from '../../types';
import { DepthValidator } from '../../services/DepthValidator';

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphNode extends Node {
  // Additional properties for force graph
  fx?: number; // Fixed x position
  fy?: number; // Fixed y position
  vx?: number; // Velocity x
  vy?: number; // Velocity y
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  relationship_type: string;
}

interface ObsidianGraphViewProps {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId?: string;
  onNodeClick?: (node: Node) => void;
  onNodeDoubleClick?: (node: Node) => void;
  onBackgroundClick?: (x: number, y: number) => void;
  width?: number;
  height?: number;
}

const OBSIDIAN_THEME = {
  background: '#1e1e1e',
  nodeColors: {
    concept: '#7c3aed',      // Purple
    process: '#059669',      // Emerald
    component: '#dc2626',    // Red
    cause: '#ea580c',        // Orange
    context: '#0284c7',      // Sky blue
    complementary: '#7c2d12', // Brown
  },
  linkColor: '#374151',
  selectedColor: '#fbbf24',
  textColor: '#f3f4f6',
  ringColor: '#374151',
};

export const ObsidianGraphView: React.FC<ObsidianGraphViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onNodeClick,
  onNodeDoubleClick,
  onBackgroundClick,
  width,
  height,
}) => {
  const simulationRef = useRef<any>();
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [dimensions, setDimensions] = useState(() => {
    const screen = Dimensions.get('window');
    return {
      width: width || screen.width,
      height: height || screen.height - 200, // Account for header/footer
    };
  });

  // Update dimensions on screen change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: width || window.width,
        height: height || window.height - 200,
      });
    });

    return () => subscription?.remove();
  }, [width, height]);

  // Initialize physics simulation
  useEffect(() => {
    const graphNodes: GraphNode[] = nodes.map((node, index) => ({
      ...node,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 100,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
    }));

    const graphLinks = edges.map(edge => ({
      source: edge.source_node_id,
      target: edge.target_node_id,
      relationship_type: edge.relationship_type,
    }));

    // Create D3 force simulation
    const simulation = forceSimulation(graphNodes)
      .force('link', forceLink(graphLinks).id((d: any) => d.id).distance(80))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(dimensions.width / 2, dimensions.height / 2))
      .on('tick', () => {
        setGraphNodes([...graphNodes]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, dimensions]);

  // Handle node interactions
  const handleNodePress = useCallback((node: GraphNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  return (
    <View style={[styles.container, { backgroundColor: OBSIDIAN_THEME.background }]}>
      <Svg width={dimensions.width} height={dimensions.height}>
        {/* Render edges */}
        {edges.map((edge, index) => {
          const sourceNode = graphNodes.find(n => n.id === edge.source_node_id);
          const targetNode = graphNodes.find(n => n.id === edge.target_node_id);
          
          if (!sourceNode || !targetNode) return null;
          
          return (
            <Line
              key={`edge-${index}`}
              x1={sourceNode.x || 0}
              y1={sourceNode.y || 0}
              x2={targetNode.x || 0}
              y2={targetNode.y || 0}
              stroke={OBSIDIAN_THEME.linkColor}
              strokeWidth="2"
              opacity={0.6}
            />
          );
        })}
        
        {/* Render nodes */}
        {graphNodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const nodeColor = OBSIDIAN_THEME.nodeColors[node.taxonomy] || '#6b7280';
          
          return (
            <React.Fragment key={node.id}>
              {/* Electron shell ring */}
              <Circle
                cx={node.x || 0}
                cy={node.y || 0}
                r={DepthValidator.getElectronShellRadius(node.depth) / 6}
                fill="none"
                stroke={DepthValidator.getDepthRingColor(node.depth)}
                strokeWidth="1"
                opacity={0.3}
              />
              
              {/* Node circle */}
              <Circle
                cx={node.x || 0}
                cy={node.y || 0}
                r="20"
                fill={nodeColor}
                stroke={isSelected ? OBSIDIAN_THEME.selectedColor : '#4b5563'}
                strokeWidth={isSelected ? "3" : "2"}
              />
              
              {/* Node label */}
              <SvgText
                x={node.x || 0}
                y={(node.y || 0) + 35}
                fontSize="12"
                fill={OBSIDIAN_THEME.textColor}
                textAnchor="middle"
              >
                {node.topic.length > 10 ? node.topic.substring(0, 10) + '...' : node.topic}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      
      {/* Invisible TouchableOpacity overlays for node interaction */}
      {graphNodes.map((node) => (
        <TouchableOpacity
          key={`touch-${node.id}`}
          style={[
            styles.nodeTouch,
            {
              left: (node.x || 0) - 25,
              top: (node.y || 0) - 25,
            },
          ]}
          onPress={() => handleNodePress(node)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  nodeTouch: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    // backgroundColor: 'rgba(255,0,0,0.1)', // Uncomment for debugging
  },
});

export default ObsidianGraphView;