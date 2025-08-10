import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Node, Edge, TaxonomyType } from '../../types';
import { ObsidianGraphView } from './ObsidianGraphView';
import { DepthValidator } from '../../services/DepthValidator';

/**
 * KnowledgeGraphDemo - Obsidian-inspired knowledge graph with physics-based visualization
 * Implements electron shell depth system with beautiful UI
 */
export const KnowledgeGraphDemo: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      topic: 'Knowledge Graphs',
      content: 'A knowledge graph is a network of real-world entities and their relationships.',
      taxonomy: 'concept' as TaxonomyType,
      depth: 0,
      knowledge_map_id: 'demo-map',
      position_x: 0,
      position_y: 20,
      created_at: Date.now(),
    },
    {
      id: '2',
      topic: 'Nodes',
      content: 'Nodes represent entities or concepts in the knowledge graph.',
      taxonomy: 'component' as TaxonomyType,
      depth: 1,
      knowledge_map_id: 'demo-map',
      parent_id: '1',
      position_x: -80,
      position_y: 120,
      created_at: Date.now(),
    },
    {
      id: '3',
      topic: 'Edges',
      content: 'Edges represent relationships between nodes.',
      taxonomy: 'component' as TaxonomyType,
      depth: 1,
      knowledge_map_id: 'demo-map',
      parent_id: '1',
      position_x: 80,
      position_y: 120,
      created_at: Date.now(),
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  // Create demo edges based on parent-child relationships
  const demoEdges: Edge[] = nodes
    .filter(node => node.parent_id)
    .map(node => ({
      id: `edge-${node.id}`,
      source_node_id: node.parent_id!,
      target_node_id: node.id,
      relationship_type: 'parent_child' as const,
      knowledge_map_id: 'demo-map',
      created_at: Date.now(),
    }));

  const handleNodePress = (node: Node) => {
    if (selectedNodeId === node.id) {
      // Second tap - show edit options
      Alert.alert(
        'Edit Node',
        `Edit "${node.topic}"`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Edit Topic', 
            onPress: () => {
              Alert.prompt(
                'Edit Topic',
                'Enter new topic:',
                (newTopic) => {
                  if (newTopic && newTopic.trim()) {
                    setNodes(nodes.map(n => 
                      n.id === node.id ? { ...n, topic: newTopic.trim() } : n
                    ));
                  }
                },
                'plain-text',
                node.topic
              );
            }
          },
          { 
            text: 'Edit Content', 
            onPress: () => {
              Alert.prompt(
                'Edit Content',
                'Enter new content:',
                (newContent) => {
                  if (newContent && newContent.trim()) {
                    setNodes(nodes.map(n => 
                      n.id === node.id ? { ...n, content: newContent.trim() } : n
                    ));
                  }
                },
                'plain-text',
                node.content
              );
            }
          },
        ]
      );
    } else {
      // First tap - select
      setSelectedNodeId(node.id);
    }
  };

  const handleCreateNode = () => {
    const newNode: Node = {
      id: Date.now().toString(),
      topic: 'New Node',
      content: 'Enter content here...',
      taxonomy: 'concept',
      depth: 0,
      knowledge_map_id: 'demo-map',
      position_x: Math.random() * 200 - 100,
      position_y: Math.random() * 200 - 100,
      created_at: Date.now(),
    };
    
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
    
    Alert.alert('Node Created', 'New node created. Tap again to edit.');
  };

  const handleBackgroundClick = () => {
    setSelectedNodeId(undefined);
  };





  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Knowledge Graph Demo</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNode}>
          <Text style={styles.createButtonText}>+ Node</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>• Tap a node to select it</Text>
        <Text style={styles.instructionText}>• Tap selected node again to edit</Text>
        <Text style={styles.instructionText}>• Use + Node button to create new nodes</Text>
        <Text style={styles.instructionText}>• Colors represent different taxonomies</Text>
      </View>

      <View style={styles.graphArea}>
        <ObsidianGraphView
          nodes={nodes}
          edges={demoEdges}
          selectedNodeId={selectedNodeId}
          onNodeClick={handleNodePress}
          onNodeDoubleClick={handleNodePress}
          onBackgroundClick={handleBackgroundClick}
        />
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          Nodes: {nodes.length} | Selected: {selectedNodeId || 'None'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
    minHeight: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  createButton: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructions: {
    padding: 12,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  instructionText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  graphArea: {
    flex: 1,
  },
  stats: {
    padding: 8,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default KnowledgeGraphDemo;