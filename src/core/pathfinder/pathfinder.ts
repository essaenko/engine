import { Queue } from 'core/pathfinder/queue';
import { Graph } from './graph';

export interface IPathNode {
  x: number;
  y: number;
}
export interface IPath {
  length: number,
  [key: number]: IPathNode
}

export class PathFinder {
  private queue: Queue;
  private path: Dict<IPathNode> = {};
  private start: IPathNode = void 0;
  private end: IPathNode = void 0;
  private current: IPathNode = void 0;
  private costs: Dict<number>  = {};

  constructor() {
    this.queue = new Queue()
  }
  
  public find = (start: number[], end: number[], graph: Graph): string[] => {
    this.reset();
    this.start = graph.getNode(start);
    this.end = graph.getNode(end);
    this.costs[`${this.start.x}:${this.start.y}`] = 0;
    this.queue.put(this.start);

    return this.findPath(graph);
  };
  
  private createPath = (): string[] => {
    let result: string[] = [`${this.end.x}:${this.end.y}`];
    let currentNode = '';

    for (let i = 0; i < Object.keys(this.path).length; i++) {
      if (currentNode === `${this.start.x}:${this.start.y}`) {
        break;
      }
      let parentNode = this.path[currentNode];
      if (currentNode === '') {
        parentNode = this.path[`${this.end.x}:${this.end.y}`];
      }
      result.push(currentNode);
      currentNode = `${parentNode.x}:${parentNode.y}`;
    }
    
    this.reset();

    return result.reverse();
  };
  
  private reset = () => {
    this.path = {};
    this.start = void 0;
    this.end = void 0;
    this.current = void 0;
    this.costs = {};
    this.queue.reset();
  };
  
  private heuristic = (node: IPathNode): number => Math.abs(this.end.x - node.x) + Math.abs(this.end.y - node.y);
  
  private findPath = (graph: Graph): string[] => {
    while (!this.queue.isEmpty) {
      this.current = this.queue.get();
      if (this.current.x === this.end.x && this.current.y === this.end.y) {
        return this.createPath();
      }
      const { x, y } = this.current;
      const neighbors = graph.neighbors([x, y]);

      neighbors.forEach((neighbor: IPathNode) => {
        const oldCost = this.costs[`${neighbor.x}:${neighbor.y}`];
        const newCost = this.costs[`${this.current.x}:${this.current.y}`] + graph.getCost(this.current, neighbor);
        if (!oldCost || newCost < oldCost) {
          this.costs[`${neighbor.x}:${neighbor.y}`] = newCost;
          const proirity = newCost + this.heuristic(neighbor);
          this.queue.put(neighbor, proirity);
          this.path[`${neighbor.x}:${neighbor.y}`] = this.current;
        }
      });
    }
    console.warn("There is no path to provided entity");
    
    return [];
  }
}