export class Queue implements IQueue {
  items: any[];

  constructor(props?: IQueueConfig) {
    this.items = [];
  }
  
  public reset = () => {
    this.items = [];
  };
  
  public get length() {
    return this.items.length;
  }
  
  public get isEmpty() {
    return this.items.length === 0;
  }
  
  public put = (item: any, priority?: number) => {
    if (priority) {
      this.items.push({ ...item, _priority: priority });
      this.items = this.items.sort((a, b) => a['_priority'] - b['_priority']);
    } else {
      this.items.unshift(item);
    }
  };
  
  public get = () => {
    if (!this.isEmpty) {
      return this.items.shift();
    }
  }
}