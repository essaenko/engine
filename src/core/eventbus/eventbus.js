export class EventBus {
    constructor() {
        this.subscribers = {};
    }

    dispatch = (event, payload) => {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach(subscriber => subscriber(payload));
        }
    };

    subscribe = (event, handler) => {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(handler);
    }
}
