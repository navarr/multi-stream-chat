const WebSocket = require('ws');

class TITSConnectionWrapper {
    socket
    connectionAttemptsOneMinute = 0
    connectionAttemptsResetTimeout

    constructor(path) {
        this.connect(path);
    }

    connect(path) {
        console.debug('Attempting connection to Twitch Integrated Throwing System', path);
        if (this.socket) {
            this.socket.close();
        }
        this.socket = new WebSocket(path);
        this.socket.addEventListener("open", (e) => {
            console.debug('Connected to TITS');
        });
        this.socket.addEventListener("error", (e) => {
            console.warn('TITS Websocket closed.  Attempting to re-open');
            ++this.connectionAttemptsOneMinute
            if (this.connectionAttemptsOneMinute <= 5 && e.error.code !== 'ECONNREFUSED') {
                console.error(e);
                if (this.connectionAttemptsResetTimeout) clearInterval(this.connectionAttemptsResetTimeout)
               this.connectionAttemptsResetTimeout = setTimeout(() => {
                    this.connectionAttemptsOneMinute = 0
                }, 1000 * 60);
                this.connect(path);
            } else {
                setTimeout(() => this.connect(path), 1000 * 60 * 5)
            }
        })
    }

    forceConnect() {

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
        // VNyan
        this.message(itemIds + " " + amount);
        return;
        // temporarily removed - TITS
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