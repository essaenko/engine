import { Queue } from 'core/pathfinder/queue';

export class PathFinder implements IPathFinder {
  private queue: IQueue;
  private path: Dict<IPathNode> = {};
  private start: IPathNode = void 0;
  private end: IPathNode = void 0;
  private current: IPathNode = void 0;
  private costs: Dict<number>  = {};

  constructor() {
    this.queue = new Queue()
  }
  
  public find = (start: number[], end: number[], graph: IGraph) => {
    this.reset();
    this.start = graph.getNode(start);
    this.end = graph.getNode(end);
    this.costs[`${this.start.x}:${this.start.y}`] = 0;
    this.queue.put(this.start);

    return this.findPath(graph);
  };
  
  private createPath = (): string[] => {
    let result: string[] = [`${this.end.x}:${this.end.y}`];
    let current = '';

    for (let i = 0; i < Object.keys(this.path).length; i++) {
      if (current === `${this.start.x}:${this.start.y}`) {
        break;
      }
      let node = this.path[current];
      if (current === '') {
        node = this.path[`${this.end.x}:${this.end.y}`];
      }
      result.push(current);
      current = `${node.x}:${node.y}`;
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
  
  private findPath = (graph: IGraph): string[] => {
    while (!this.queue.isEmpty) {
      this.current = this.queue.get();
      if (this.current.x === this.end.x && this.current.y === this.end.y) {
        return this.createPath();
      }
      const { x, y } = this.current;
      const neighbors = graph.neighbors([x, y]);

      neighbors.forEach((neighbor: IPathNode) => {
        const oldCost = this.costs[`${neighbor.x}:${neighbor.y}`];
        const newCost = this.costs[`${this.current.x}:${this.current.y}`] + neighbor.cost;
        if (!oldCost || newCost < oldCost) {
          this.costs[`${neighbor.x}:${neighbor.y}`] = newCost;
          const proirity = newCost + this.heuristic(neighbor);
          this.queue.put(neighbor, proirity);
          this.path[`${neighbor.x}:${neighbor.y}`] = this.current;
        }
      });
    }
    throw Error('Not found');
  }
}