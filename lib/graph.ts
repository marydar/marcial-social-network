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