export class EventBus implements IEventBus {
    public subscribers;

    constructor() {
        this.subscribers = {};
    }

    dispatch = (event: string, payload?: any) => {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(subscriber => subscriber(payload));
        }
    };

    subscribe = (event: string, handler: (payload: any) => void): void => {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(handler);
    };
    
    unsubscribe = (event, handler) => {
      this.subscribers[event] = this.subscribers[event].filter((subscriber) => subscriber !== handler);
    }
}
