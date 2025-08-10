// Core taxonomy types based on knowledge graph domain
export type TaxonomyType = 
  | 'concept' 
  | 'process' 
  | 'component' 
  | 'cause' 
  | 'context' 
  | 'complementary';

// Edge relationship types
export type EdgeType = 'parent_child' | 'cross_file' | 'ai_suggested' | 'manual';

// Simple node interface for demo
export interface Node {
  id: string;
  topic: string;
  content: string;
  taxonomy: TaxonomyType;
  depth: number;
  knowledge_map_id: string;
  parent_id?: string;
  position_x?: number;
  position_y?: number;
  created_at: number;
}

// Simple edge interface for demo
export interface Edge {
  id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type: EdgeType;
  knowledge_map_id: string;
  created_at: number;
}