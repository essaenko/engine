export class Queue {
  items: any[];

  constructor(props?: {}) {
    this.items = [];
  }
  
  public reset = (): void => {
    this.items = []; 
  };
  
  public get length(): number {
    return this.items.length;
  }
  
  public get isEmpty(): boolean {
    return this.items.length === 0;
  }
  
  public put = (item: any, priority?: number): void => {
    if (priority) {
      this.items.push({ ...item, _priority: priority });
      this.items = this.items.sort((a, b) => a['_priority'] - b['_priority']);
    } else {
      this.items.unshift(item);
    }
  };
  
  public get = (): any => {
    if (!this.isEmpty) {
      return this.items.shift();
    }
  }
}