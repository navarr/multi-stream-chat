const {Client} = require('node-osc');

class OscConnectionWrapper {
    socket
    boopOffTimeout
    boopPath = '/avatar/parameters/Gifts/Boop'
    giftPath = '/avatar/parameters/Gifts/'
    timeoutMap = {};
    giftDelay = {
        'Heart_Me': 7,
        'Lightning_Bolt': 7,
        'Rose': 7,
        'Finger_Heart': 7,
        'Tiny_Diny': 15,
        'Doughnut': 7,
        'Hat_and_Mustache': 15,
        'Game_Controller': 10,
        'Sunglasses': 15,
        'Fireworks': 15,
        'Galaxy': 15,
        'Boop': 1,
        'Pumpkin': 7,
        'Ghost': 7
    }

    constructor(host, port) {
        this.connect(host, port);
    }

    connect(host, port) {
        console.debug('Attempting connection to OSC');
        this.socket = new Client(host, port);
    }

    sendBool(address, value) {
        console.debug('Sending', address, value);
        this.socket.send({
            address,
            args: {
                type: 'b',
                value
            }
        });
    }

    sendInt(address, value) {
        this.socket.send({
            address,
            args: {
                type: 'i',
                value
            }
        })
    }

    sendFloat(address, value) {
        this.socket.send({
            address,
            args: {
                type: 'f',
                value
            }
        })
    }

    sendBoop() {
        this.sendBool(this.boopPath, true);
        clearTimeout(this.boopOffTimeout);
        this.boopOffTimeout = setTimeout(() => {
            this.sendBool(this.boopPath, false)
        }, 1000);
    }

    sendHyroeActivation(giftName) {
        this.sendBool(this.giftPath + giftName, true);
        if (this.timeoutMap[giftName] != undefined) {
            clearTimeout(this.timeoutMap[giftName]);
        }
        this.timeoutMap[giftName] = setTimeout(() => {
            this.sendBool(this.giftPath + giftName, false)
        }, (this.giftDelay[giftName] ?? 1) * 1000);
    }
}

module.exports = {OscConnectionWrapper}