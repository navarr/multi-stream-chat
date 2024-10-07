import {Event} from '../event/Event';

class EventHandler {
    private eventListeners: Record<string, Array<Function>> = {};

    public submitEvent(event: Event) {
        const name = event.eventType;
        if (typeof this.eventListeners[name] === 'undefined') return;

        this.eventListeners[name].forEach((eventListener) => {
            eventListener(event);
        });
    }

    public addListener(eventName: string, callback: Function) {
        if (typeof this.eventListeners[eventName] === 'undefined') {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
}

const eventHandler = new EventHandler();

export { eventHandler }