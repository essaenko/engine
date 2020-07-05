export class EventBus {
  public subscribers: Dict<Array<(payload: any) => void>>;
  
  constructor() {
    this.subscribers = {}; 
  }
  
  public dispatch = <T>(event: string, payload?: T): void => {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach(subscriber => subscriber(payload));
    }
    
    return void 0;
  };
  
  public subscribe = <T>(event: string, handler: (payload: T) => void): void => {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    if (!this.subscribers[event].includes(handler)) {
      this.subscribers[event].push(handler);
    }
    
    return void 0;
  };
  
  public unsubscribe = <T>(event: string, handler: (payload: T) => void): void => {
    this.subscribers[event] = this.subscribers[event].filter((subscriber) => subscriber !== handler);

    return void 0;
  };
}
