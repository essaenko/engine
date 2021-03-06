import { IPathNode } from 'core/pathfinder'

export class Graph {
  private width: number = 0;
  private height: number = 0;
  private map: IPathNode[][] = [];
  private allowDiagonals: boolean = true;
  
  constructor(props: {
    width: number;
    height: number;
    map: number[];
    allowDiagonals?: boolean;
  }
  ) {
    this.width = props.width;
    this.height = props.height;
    this.denormalizeMap(props.map);
    if (props.allowDiagonals !== void 0) {
      this.allowDiagonals = props.allowDiagonals
    }
  }
  
  private denormalizeMap = (map: number[]) => {
    for (let row = 0; row < this.height; row ++) {
      if (!this.map[row]) {
        this.map[row] = [];
      }
      for (let col = 0; col < this.width; col++) {
        this.map[row][col] = map[row * this.height + col] === 0 && {
          x: col,
          y: row,
        };
      }
    }
  };

  public getCost = (from: IPathNode, to: IPathNode): number => {
    if (from.x !== to.x && from.y !== to.y) return 1.5;
    return 1;
  };
  
  public getNode = (item: number[]): IPathNode => {
    return this.map[item[1]][item[0]];
  };
  
  public neighbors = (item: number[]): IPathNode[] => {
    const neighbors = [];
    if (this.map[item[1]][item[0] + 1]) neighbors.push(this.map[item[1]][item[0] + 1]);
    if (this.map[item[1] - 1][item[0]]) neighbors.push(this.map[item[1] - 1][item[0]]);
    if (this.map[item[1]][item[0] - 1]) neighbors.push(this.map[item[1]][item[0] - 1]);
    if (this.map[item[1] + 1][item[0]]) neighbors.push(this.map[item[1] + 1][item[0]]);

    if (this.allowDiagonals) {
      if (
        this.map[item[1] + 1][item[0] + 1] &&
        this.map[item[1]][item[0] + 1] &&
        this.map[item[1] + 1][item[0]]
        ) neighbors.push(this.map[item[1] + 1][item[0] + 1]);
      if (
        this.map[item[1] - 1][item[0] + 1] &&
        this.map[item[1]][item[0] + 1] &&
        this.map[item[1] - 1][item[0]]
        ) neighbors.push(this.map[item[1] - 1][item[0] + 1]);
      if (
        this.map[item[1] - 1][item[0] - 1] &&
        this.map[item[1] - 1][item[0]] &&
        this.map[item[1]][item[0] - 1]
        ) neighbors.push(this.map[item[1] - 1][item[0] - 1]);
      if (
        this.map[item[1] + 1][item[0] - 1] &&
        this.map[item[1] - 1][item[0]] &&
        this.map[item[1] + 1][item[0]]
        ) neighbors.push(this.map[item[1] + 1][item[0] - 1]);
    }
    
    return neighbors;
  }
}