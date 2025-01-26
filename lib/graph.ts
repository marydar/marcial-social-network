// class GraphNode {
//     value: any;
//     neighbors: GraphNode[];
  
//     constructor(value: any) {
//       this.value = value;
//       this.neighbors = [];
//     }
  
//     addNeighbor(node: GraphNode) {
//       this.neighbors.push(node);
//     }
//     removeNeighbor(node: GraphNode) {
//       this.neighbors = this.neighbors.filter((n) => n !== node);
//     }
//   }
//   export class Graph {
//     nodes: GraphNode[];
  
//     constructor() {
//       this.nodes = [];
//     }
  
//     addNode(value: any) {
//       const node = new GraphNode(value);
//       this.nodes.push(node);
//     }
//     removeNode(username: any) {
//         this.nodes = this.nodes.filter((node) => node.value.username !== username);
//         this.nodes.forEach((node) => {
//             node.neighbors = node.neighbors.filter((neighbor) => neighbor.value.username !== username);
//         }); 
//     }
  
//     addEdge(fromUsername: any, toUsername: any) {
//       const from = this.nodes.find((node) => node.value.username === fromUsername);
//       const to = this.nodes.find((node) => node.value.username === toUsername);
//       from.addNeighbor(to);
//       to.addNeighbor(from);
//     }
//     removeEdge(fromUsername: any, toUsername: any) {
//       const from = this.nodes.find((node) => node.value.username === fromUsername);
//       const to = this.nodes.find((node) => node.value.username === toUsername);
//       from.removeNeighbor(to);
//       to.removeNeighbor(from);
//     }
  
//     bfs(start: GraphNode, end: GraphNode) {
//       const queue: GraphNode[] = [start];
//       const visited: GraphNode[] = [];
  
//       while (queue.length > 0) {
//         const current = queue.shift();
//         if (current === end) {
//           return true;
//         }
//         visited.push(current);
  
//         for (const neighbor of current.neighbors) {
//           if (!visited.includes(neighbor)) {
//             queue.push(neighbor);
//           }
//         }
//       }
  
//       return false;
//     }
//   }
  export class GraphMatrix {
    private adjacencyMatrix: Map<string, Map<string, number>>;

    constructor() {
        this.adjacencyMatrix = new Map();
    }

    addNode(value: string): void {
        if (!this.adjacencyMatrix.has(value)) {
            // Add new key
            this.adjacencyMatrix.set(value, new Map());

            //add all the keys for this new row's map
            //add this key to all the other keys' maps
            this.adjacencyMatrix.forEach((row, key) => {
              row.set(value, 0);
              if (key !== value) {
                  this.adjacencyMatrix.get(value)?.set(key, 0);
              }
          });
          
        } else {
            console.log(`${value} already exists in the graph.`);
        }
    }

    removeNode(value: string): void {
        if (this.adjacencyMatrix.has(value)) {
            // Remove the row with key == value
            this.adjacencyMatrix.delete(value);

            // Remove the column with key == value for all rows
            this.adjacencyMatrix.forEach(row => {
              row.delete(value);
          });
          
        } else {
            console.log(`${value} does not exist in the graph.`);
        }
    }

    addEdge(from: string, to: string): void {
        if (this.adjacencyMatrix.has(from) && this.adjacencyMatrix.has(to)) {
            this.adjacencyMatrix.get(from)?.set(to, 1);
        } else {
            console.log(`Either ${from} or ${to} does not exist in the graph.`);
        }
    }

    removeEdge(from: string, to: string): void {
        if (this.adjacencyMatrix.has(from) && this.adjacencyMatrix.has(to)) {
            this.adjacencyMatrix.get(from)?.set(to, 0);
        } else {
            console.log(`Either ${from} or ${to} does not exist in the graph.`);
        }
    }

    printMatrix(): void {
        console.log('Adjacency Matrix:');
        const nodes = Array.from(this.adjacencyMatrix.keys());
        console.log(`\t${nodes.join('\t')}`);
        for (let key of nodes) {
            const row = this.adjacencyMatrix.get(key) || new Map();
            const rowValues = nodes.map(node => row.get(node) || 0);
            console.log(`${key}\t${rowValues.join('\t')}`);
        }
    }
    suggest(graph: GraphMatrix, myUsername: string): string[] {
      this.printMatrix();
      let count = 0;
      if (!graph.adjacencyMatrix.has(myUsername)) {
          console.log(`${myUsername} does not exist in the graph.`);
          return [];
      }

      const suggestions: { username: string; score: number }[] = [];
      const myRow = graph.adjacencyMatrix.get(myUsername) || new Map();

      graph.adjacencyMatrix.forEach((row, username) => {
          if (username === myUsername) return;

          let mutuals = 0;
          let sum = 0;
          //if not foolowed by current user
          if ( this.adjacencyMatrix.get(myUsername).get(username) === 0){
            // calculate score
            row.forEach((value, key) => {
                const myValue = myRow.get(key) || 0;
                if (value === 1 && myValue === 1) {
                    mutuals++;
                }
                if (value === 1 || myValue === 1) {
                    sum++;
                }
            });
            if (sum > 0) {
                const score = mutuals / sum;
                if(score > 0 && score < 1){
                    if( username !== myUsername){
                      suggestions.push({ username, score });
                      count++;
                    }
                }
            }
          }
          
      });
        
        if(count < 7){
            //new users and not followed by current user
            const end = graph.adjacencyMatrix.keys().filter(key => !suggestions.map(s => s.username).includes(key) && this.adjacencyMatrix.get(myUsername).get(key) === 0);
            end.forEach(key => {
                if(count < 6) {
                    if( key !== myUsername){
                        suggestions.push({ username: key, score: 0 });
                        count++;
                    }

                }
            });
            console.log("count12",count);
        }

      suggestions.sort((a, b) => b.score - a.score);
      console.log("-----suggestions------", suggestions);
      //only return the top 6 suggestions
      return suggestions.slice(0, 6).map(s => s.username);
  }
}


  // export const getSuggestions = (graph: Graph, username: string) => {
  //   console.log("graph", graph.nodes);
  //   const suggestions = [];
  //   const user = graph.nodes.find((node) => node.value.username === username);
  //   graph.nodes.forEach((node) => {
  //     let mutualNeighbors = 0;
  //     console.log("nodeha", node.value.username);
  //     if (node.neighbors.length >= 0 && node !== user) {
  //       // console.log("node", node.value.username);
  //       node.neighbors.forEach((neighbor) => {
  //         if (neighbor.value.username === username) {
  //           mutualNeighbors++;
  //         }
  //       });
  //       console.log("mutualNeighbors", mutualNeighbors);
        
  //       console.log("neigh", node.neighbors, "AND", user.neighbors);
  //       let score = mutualNeighbors / (node.neighbors.length +  user.neighbors.length);
  //       console.log("score: ",score,"with", node.value.username);
  //       console.log("all", node.neighbors.length +  user.neighbors.length);
  //       console.log("mutual: ",mutualNeighbors);
        
  //       if(score > 0 && score < 1){
  //           suggestions.push(node.value);
  //       }
  //     }
  //   });
  //   return suggestions;
    
  // };

  