/**
 * A priority queue with highest priority always on top
 * This queue is sorted by priority for each enqueue
 */
import { PriorityNode } from './PriorityNode';

export class PriorityQueue {
  nodes: PriorityNode[] = [];

  /**
     * Enqueue a new node
     * @param {[type]} priority
     * @param {[type]} key
     */
  enqueue(priority: number, key: string) {
    this.nodes.push(new PriorityNode(key, priority));
    this.nodes.sort(function(a, b) {
      return a.priority - b.priority;
    });
  }

  /**
     * Dequeue the highest priority key
     */
  dequeue(): string {
    return this.nodes.shift().key;
  }

  /**
     * Checks if empty
     */
  empty(): boolean {
    return !this.nodes.length;
  }
}
