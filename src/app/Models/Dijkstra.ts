import { PriorityQueue } from './PriorityQueue';

/**
 * Computes the shortest path between two node
 */

export class Dijkstra {
  infinity = 1 / 0;
  vertices = {};

  /**
     * Add a new vertex and related edges
     * @param {[type]} name  [description]
     * @param {[type]} edges [description]
     */
  addVertex(name: string, edges: any) {
    this.vertices[name] = edges;
  }

  /**
     * Computes the shortest path from start to finish
     * @param {[type]} start  [description]
     * @param {[type]} finish [description]
     */
  shortestPath(start: string, finish: string) {
    let  smallest,
      alt;
    const nodes = new PriorityQueue(),
    distances = {},
    previous = {},
    path = [];

    // Init the distances and queues variables
    Object.keys(this.vertices).forEach(vertex => {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      } else {
        distances[vertex] = this.infinity;
        nodes.enqueue(this.infinity, vertex);
      }

      previous[vertex] = null;
    });

    // continue as long as the queue haven't been emptied.
    while (!nodes.empty()) {
      smallest = nodes.dequeue();
      // we are the last node
      if (smallest === finish) {
        // Compute the path
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }

      // No distance known. Skip.
      if (!smallest || distances[smallest] === this.infinity) {
        continue;
      }

      // Compute the distance for each neighbor
      Object.keys(this.vertices[smallest]).forEach(neighbor => {
        alt = distances[smallest] + this.vertices[smallest][neighbor];
                if (alt < distances[neighbor]) {
                  distances[neighbor] = alt;
                  previous[neighbor] = smallest;
                  nodes.enqueue(alt, neighbor);
                }
      });
    }
    // the starting point isn't in the solution &
    // the solution is from end to start.
    return path.concat(start).reverse();
  }
}
