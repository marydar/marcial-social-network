class GraphNode {
    value: any;
    neighbors: GraphNode[];
  
    constructor(value: any) {
      this.value = value;
      this.neighbors = [];
    }
  
    addNeighbor(node: GraphNode) {
      this.neighbors.push(node);
    }
    removeNeighbor(node: GraphNode) {
      this.neighbors = this.neighbors.filter((n) => n !== node);
    }
  }
  export class Graph {
    nodes: GraphNode[];
  
    constructor() {
      this.nodes = [];
    }
  
    addNode(value: any) {
      const node = new GraphNode(value);
      this.nodes.push(node);
    }
    removeNode(username: any) {
        this.nodes = this.nodes.filter((node) => node.value.username !== username);
        this.nodes.forEach((node) => {
            node.neighbors = node.neighbors.filter((neighbor) => neighbor.value.username !== username);
        }); 
    }
  
    addEdge(fromUsername: any, toUsername: any) {
      const from = this.nodes.find((node) => node.value.username === fromUsername);
      const to = this.nodes.find((node) => node.value.username === toUsername);
      from.addNeighbor(to);
      to.addNeighbor(from);
    }
    removeEdge(fromUsername: any, toUsername: any) {
      const from = this.nodes.find((node) => node.value.username === fromUsername);
      const to = this.nodes.find((node) => node.value.username === toUsername);
      from.removeNeighbor(to);
      to.removeNeighbor(from);
    }
  
    bfs(start: GraphNode, end: GraphNode) {
      const queue: GraphNode[] = [start];
      const visited: GraphNode[] = [];
  
      while (queue.length > 0) {
        const current = queue.shift();
        if (current === end) {
          return true;
        }
        visited.push(current);
  
        for (const neighbor of current.neighbors) {
          if (!visited.includes(neighbor)) {
            queue.push(neighbor);
          }
        }
      }
  
      return false;
    }
  }
  