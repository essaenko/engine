
export class Graph implements IGraph {
  private width: number = 0;
  private height: number = 0;
  private map: IPathNode[][] = [];
  
  constructor(props: IGraphConfig) {
    this.width = props.width;
    this.height = props.height;
    this.denormalizeMap(props.map);
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

    
    return neighbors;
  }
}