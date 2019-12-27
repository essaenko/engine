export class EventBus implements IEventBus {
  public subscribers: Dict<Array<(payload: any) => void>>;
  
  constructor() {
    this.subscribers = {};
  }
  
  dispatch = (event: string, payload?: any): void => {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(subscriber => subscriber(payload));
    }
    
    return void 0;
  };
  
  subscribe = (event: string, handler: (payload: any) => void): void => {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    return void this.subscribers[event].push(handler);
  };
  
  unsubscribe = (event: string, handler: (payload: any) => void): void => {
    this.subscribers[event] = this.subscribers[event].filter((subscriber) => subscriber !== handler);

    return void 0;
  };
}
