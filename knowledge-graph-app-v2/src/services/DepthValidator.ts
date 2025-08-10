import { Node } from '../types';

/**
 * DepthValidator - Manages depth consistency and validation for knowledge graph hierarchy
 * Ensures proper parent-child depth relationships and electron shell constraints
 */
export class DepthValidator {
  
  /**
   * Validates that a node's depth is consistent with its parent and children
   */
  static validateNodeDepth(node: Node, allNodes: Node[]): boolean {
    // Root nodes (depth 0) should have no parent
    if (node.depth === 0 && node.parent_id) {
      return false;
    }

    // Non-root nodes should have a parent
    if (node.depth > 0 && !node.parent_id) {
      return false;
    }

    // Check parent relationship
    if (node.parent_id) {
      const parent = allNodes.find(n => n.id === node.parent_id);
      if (!parent) {
        return false; // Parent doesn't exist
      }
      
      // Parent must have lower depth
      if (parent.depth >= node.depth) {
        return false;
      }
      
      // Depth should be exactly parent.depth + 1
      if (node.depth !== parent.depth + 1) {
        return false;
      }
    }

    // Check children relationships
    const children = allNodes.filter(n => n.parent_id === node.id);
    for (const child of children) {
      // Children must have higher depth
      if (child.depth <= node.depth) {
        return false;
      }
      
      // Child depth should be exactly node.depth + 1
      if (child.depth !== node.depth + 1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculates the correct depth for a node based on its parent
   */
  static calculateCorrectDepth(parentId: string | undefined, allNodes: Node[]): number {
    if (!parentId) {
      return 0; // Root node
    }

    const parent = allNodes.find(n => n.id === parentId);
    if (!parent) {
      return 0; // Default to root if parent not found
    }

    return parent.depth + 1;
  }

  /**
   * Gets all nodes at a specific depth level
   */
  static getNodesAtDepth(depth: number, allNodes: Node[]): Node[] {
    return allNodes.filter(node => node.depth === depth);
  }

  /**
   * Gets the maximum depth in the graph
   */
  static getMaxDepth(allNodes: Node[]): number {
    return Math.max(...allNodes.map(node => node.depth), 0);
  }

  /**
   * Validates the entire graph for depth consistency
   */
  static validateGraphDepthConsistency(allNodes: Node[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const node of allNodes) {
      if (!this.validateNodeDepth(node, allNodes)) {
        errors.push(`Node "${node.topic}" (depth ${node.depth}) has invalid depth relationship`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Fixes depth inconsistencies by recalculating depths from root nodes
   */
  static fixDepthInconsistencies(allNodes: Node[]): Node[] {
    const fixedNodes = [...allNodes];
    const processed = new Set<string>();

    // Process nodes level by level starting from roots
    const processLevel = (currentDepth: number) => {
      const nodesAtLevel = fixedNodes.filter(n => 
        n.depth === currentDepth && !processed.has(n.id)
      );

      for (const node of nodesAtLevel) {
        // Validate and fix this node's depth
        const correctDepth = this.calculateCorrectDepth(node.parent_id, fixedNodes);
        if (node.depth !== correctDepth) {
          node.depth = correctDepth;
        }

        processed.add(node.id);

        // Process children
        const children = fixedNodes.filter(n => n.parent_id === node.id);
        for (const child of children) {
          if (!processed.has(child.id)) {
            child.depth = node.depth + 1;
          }
        }
      }
    };

    // Process up to maximum possible depth
    for (let depth = 0; depth <= 10; depth++) {
      processLevel(depth);
    }

    return fixedNodes;
  }

  /**
   * Gets the electron shell ring radius for a given depth
   */
  static getElectronShellRadius(depth: number): number {
    // Base radius + incremental spacing for each depth level
    const baseRadius = 80;
    const depthSpacing = 120;
    return baseRadius + (depth * depthSpacing);
  }

  /**
   * Gets the color for a depth ring
   */
  static getDepthRingColor(depth: number): string {
    const colors = [
      '#FF6B6B20', // Depth 0 - Light red
      '#4ECDC420', // Depth 1 - Light teal
      '#45B7D120', // Depth 2 - Light blue
      '#96CEB420', // Depth 3 - Light green
      '#FFEAA720', // Depth 4 - Light yellow
      '#DDA0DD20', // Depth 5 - Light purple
      '#F4A46120', // Depth 6 - Light orange
      '#98D8C820', // Depth 7 - Light mint
      '#F7DC6F20', // Depth 8 - Light gold
      '#BB8FCE20', // Depth 9 - Light lavender
      '#85C1E920', // Depth 10 - Light sky
    ];
    
    return colors[depth] || colors[colors.length - 1];
  }
}