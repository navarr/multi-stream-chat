import {WebSocket} from 'ws';
import {
    CommentEvent,
    EmoteChatEvent,
    FollowEvent,
    GiftEvent,
    LikeEvent,
    ShareEvent,
    SubscribeEvent
} from '@tiktoklive/types'
import {EventEmitter} from "events";

class EulerConnectionWrapper extends EventEmitter {
    clientDisconnected: boolean = true
    reconnectEnabled: boolean = true
    reconnectCount: number = 0
    reconnectWaitMs: number = 1000
    maxReconnectAttempts: number = 5
    endpointUrl: string
    websocket: WebSocket

    constructor(apiKey: string, uniqueId: string) {
        super();
        this.endpointUrl = `wss://cloud.eulerstream.com/ws?api_key=${apiKey}&unique_id=${uniqueId}`;
    }

    connect(isReconnect) {
        try {this.websocket.close(); } catch(e) {}

        this.websocket = new WebSocket(this.endpointUrl);

        this.websocket.on('open', () => {
            this.clientDisconnected = false;
            console.log('Connected to Euler Server');
        })

        this.websocket.on('error', (e) => {
            console.error('EulerStream connection error');
            this.clientDisconnected = true;
            if (this.reconnectEnabled) {
                while(this.reconnectCount < this.maxReconnectAttempts) {
                    ++this.reconnectCount;
                    this.connect(true);
                }
            }
        })

        this.websocket.on('close', () => {
            this.clientDisconnected = true;
            console.log('Disconnected from Euler Server');
            this.emit('disconnect');
        })

        this.websocket.on('message', (rawMessage: Record<string, any>) => {
            const message = JSON.parse(rawMessage);
            if (message.type !== 'tiktok_event') {
                // Safely ignore
                return;
            }

            switch(message.name) {
                case 'ConnectEvent':
                    console.log('Received Connect Event');
                    this.emit('connect');
                    break;
                case 'DisconnectEvent':
                    this.websocket.close();
                    break;
                case 'CommentEvent':
                    this.emit('chat', message.data as CommentEvent);
                    break;
                case 'FollowEvent':
                    this.emit('follow', message.data as FollowEvent);
                    break;
                case 'ShareEvent':
                    this.emit('share', message.data as ShareEvent);
                    break;
                case 'ControlEvent':
                    if (message.data.action === 'STREAM_ENDED') {
                        this.clientDisconnected = true;
                        this.reconnectEnabled = false;
                        this.websocket.close();
                    } else if (message.data.action === 'STREAM_PAUSED') {
                        this.emit('pause');
                    } else if (message.data.action === 'STREAM_UNPAUSED') {
                        this.emit('unpause');
                    } else {
                        console.log('ControlEvent', message.data);
                    }
                    break;
                case 'GiftEvent':
                    this.emit('gift', message.data as GiftEvent);
                    break;
                case 'LikeEvent':
                    this.emit('like', message.data as LikeEvent);
                    break;
                case 'SubscribeEvent':
                    this.emit('subscribe', message.data as SubscribeEvent);
                    break;
                case 'SocialEvent':
                    if (message.data.action === '1') {
                        this.emit('follow', message.data as FollowEvent);
                    } else if (message.data.action === '3') {
                        this.emit('share', message.data as ShareEvent);
                    } else {
                        console.log('SocialEvent', message.data);
                    }
                    break;
                case 'RoomEvent':
                    // Became No x member on the team. (First Heart Me)
                    break;
                case 'BarrageEvent':
                    // VIP Join, seen for gift levels
                    // data.userGradeParam.user.nickname
                    // data.userGradeParam.user.displayId
                    // data.userGradeParam.currentGrade (Level - e.g. 35)
                    // background at data.background.urlList[0]
                    // icon at data.icon.urlList[0]
                    break;
                case 'GoalUpdateEvent':
                    // data.indicator.op
                case 'WebsocketResponseEvent':
                case 'JoinEvent':
                case 'RoomUserSeqEvent':
                case 'LinkMicFanTicketMethodEvent':
                case 'RankTextEvent': // Became the No. X viewer updates
                case 'ImDeleteEvent': // Delete all messages of User via ID
                case 'LinkLayerEvent':
                case 'LinkMicMethodEvent':
                case 'LinkMicBattleEvent': // Battle Start
                case 'LinkMicArmiesEvent': // Not 100% sure
                case 'RoomPinEvent': // Pinned Message, stored encoded as data.pinnedMessage
                    break;
                case 'UnknownEvent':
                    if (message.data.method === 'WebcastGiftBroadcastMessage') {
                        // Someone sent a universe to somebody
                    } else if (message.data.method === 'WebcastLinkmicBattleTaskMessage') {
                        // Battle stuff
                    } else {
                        //console.log('UnknownEvent', message.data.method, atob(message.data.payload));
                    }
                    break;
                default:
                    console.log('Event: ', message.name, message.data);
            }
        })
    }
}

module.exports = {
    EulerConnectionWrapper
}