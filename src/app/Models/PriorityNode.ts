/**
 * A node for priorioty linked list / stack and such
 */
export class PriorityNode {
  key: string;
  priority: number;

  constructor(key: string, priority: number) {
    this.key = key;
    this.priority = priority;
    }
}
