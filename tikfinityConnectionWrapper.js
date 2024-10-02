const WebSocket = require('ws')

class TikfinityConnectionWrapper {
    connection
    connectionAttemptsOneMinute = 0
    connectionAttemptsResetTimeout
    wsPath

    constructor(path) {
        this.wsPath = path
        console.debug('Setting up Websocket for Tikfinity: ' + path);
        this.connection = new WebSocket(path);
    }

    connect() {
        console.debug('Attempting to connect to TikFinity software...')
        if (this.connection) {
            this.connection.close();
        }

        this.connection.addEventListener('open', () => {
            console.debug('Connected to TikFinity');
        });
        this.connection.addEventListener('error', (e) => {
            console.warn('TikFinity Websocket Closed.  Attempting to re-open');
            ++this.connectionAttemptsOneMinute;
            if (this.connectionAttemptsOneMinute <= 5 && e.error.code !== 'ECONNREFUSED') {
                console.error(e);
                if (this.connectionAttemptsResetTimeout) clearInterval(this.connectionAttemptsResetTimeout)
                this.connectionAttemptsResetTimeout = setTimeout(() => {
                    this.connectionAttemptsOneMinute = 0;
                }, 1000 * 60);
                this.connect();
            } else {
                setTimeout(() => this.connect(), 1000 * 60 * 5);
            }
        })
    }
}

module.exports = {
    TikfinityConnectionWrapper
}