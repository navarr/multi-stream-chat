import {configManager} from "../../framework/ConfigHandler";
import {WebSocket} from 'ws';
import {logger} from "../../framework/Logger";

export class ConnectionHandler {
    private readonly CONFIG_PATH_MAX_CONNECTIONS = 'EULER_CONNECTIONS_MAX';
    private readonly CONFIG_PATH_EULER_API_KEY = 'EULER_API_KEY';

    private readonly maxConnections: number = 1;
    private totalConnections: number = 0;
    private readonly connections: Record<string, WebSocket|null> = {};

    constructor() {
        const configuredMaxConnections = configManager.get(this.CONFIG_PATH_MAX_CONNECTIONS);
        if (configuredMaxConnections) {
            this.maxConnections = parseInt(configuredMaxConnections);
        }
    }

    private getEndpointUrl(apiKey: string, username: string): string {
        return `wss://cloud.eulerstream.com/ws?api_key=${apiKey}&unique_id=${username}`;
    }

    public hasConnectionFor(username: string): boolean {
        const normalizedUsername = this.normalizerUsername(username);
        return typeof this.connections[normalizedUsername] !== 'undefined' && this.connections[normalizedUsername] !== null;
    }

    public getConnection(username: string): WebSocket {
        const normalizedUsername = this.normalizerUsername(username);
        if (!this.hasConnectionFor(normalizedUsername)) {
            if (this.totalConnections + 1 > this.maxConnections) {
                throw "Maximum Connections Reached";
            }
            ++this.totalConnections;
            logger.info(`Initializing new Euler FC Websocket for ${normalizedUsername}`);
            const endpointUrl = this.getEndpointUrl(configManager.get(this.CONFIG_PATH_EULER_API_KEY), normalizedUsername);
            logger.debug(`Connection to FC Endpoint: ${endpointUrl}`)
            this.connections[normalizedUsername] = <WebSocket>new WebSocket(endpointUrl);
            this.createCleanupEventsForWebsocket(normalizedUsername);
            this.addWebsocketMessageDebugLogging(normalizedUsername);
        } else {
            logger.info(`Euler FC Connection Handler is returning existing WebSocket connection for ${normalizedUsername}`);
        }

        return this.connections[normalizedUsername];
    }

    private normalizerUsername(username: string): string {
        return username.toLowerCase();
    }

    private createCleanupEventsForWebsocket(normalizedUsername: string): void {
        const socket = this.connections[normalizedUsername];

        socket.on('close', () => {
            logger.info(`Euler FC WebSocket for ${normalizedUsername} has closed`);
            this.connections[normalizedUsername] = null;
            --this.totalConnections;
        });
        socket.on('message', (rawMessage: string) => {
            const message = JSON.parse(rawMessage);
            if (typeof message.type !== 'undefined' && message.type === 'tiktok_event' && message.name === 'DisconnectEvent') {
                logger.info(`Received DisconnectEvent for Euler FC WebSocket for ${normalizedUsername}`);
                socket.close();
            }
        });
        socket.on('error', (error) => {
            logger.warn('Euler FC WebSocket Error', error);
            try {
                logger.info(`Attempting to close Euler FC Socket for ${normalizedUsername}`);
                socket.close();
            } catch {
                logger.info(`Exception thrown while closing socket for ${normalizedUsername}, assuming already closed and updating internal state`);
                this.connections[normalizedUsername] = null;
                --this.totalConnections;
            }
        })
    }

    private addWebsocketMessageDebugLogging(normalizedUsername: string): void {
        const socket = this.connections[normalizedUsername];

        socket.on('message', (rawMessage: string) => {
            const message = JSON.parse(rawMessage);
            logger.debug('Euler FC WebSocket Message', message);
        });
    }

    public closeAll(): void {
        for(let username in this.connections) {
            const socket = this.connections[username];
            if (socket) {
                socket.close();
            }
        }
    }
}

const connectionHandler = new ConnectionHandler();

export {connectionHandler};