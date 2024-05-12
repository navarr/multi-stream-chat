const WebSocket = require('ws');

class TITSConnectionWrapper {
    constructor(path) {
        this.connect(path);
    }

    connect(path) {
        console.debug('Attempting connection to websocket', path);
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new WebSocket(path);
        this.socket.addEventListener("open", (e) => {
            console.debug('Connected to Websocket');
        });
        this.socket.addEventListener("error", (e) => {
            console.warn('Websocket closed.  Attempting to re-open');
            this.connect(path);
        })
    }

    message(data) {
        if (this.socket) {
            this.socket.send(data);
        }
    }
}

module.exports = {TITSConnectionWrapper}