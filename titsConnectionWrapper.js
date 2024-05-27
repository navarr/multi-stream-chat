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

    send(data) {
        this.message(data)
    }

    throwItem(itemId, amount) {
        this.throwItems([itemId], amount);
    }

    throwItems(itemIds, amount) {
        const message = {
            "apiName":"TITSPublicApi",
            "apiVersion":"1.0",
            "requestID":"someID",
            "messageType":"TITSThrowItemsRequest",
            "data": {
                "items": itemIds,
                "amountOfThrows": amount,
                "delayTime": 0.05,
                "errorOnMissingID": false
            }
        }
        this.message(JSON.stringify(message));
    }
}

module.exports = {TITSConnectionWrapper}