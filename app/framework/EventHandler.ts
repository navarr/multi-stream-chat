class EventHandler {
    private eventListeners: Record<string, Array<Function>>;

    public submitEvent(name: string, event: any) {
        if (typeof this.eventListeners[name] === 'undefined') return;

        this.eventListeners[name].forEach((eventListener) => {
            eventListener(event);
        });
    }

    private addListener(eventName: string, callback: Function) {
        if (typeof this.eventListeners[eventName] === 'undefined') {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }
}

const eventHandler = new EventHandler();

export { eventHandler }