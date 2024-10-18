import {configManager} from "../../framework/ConfigHandler";
import {WebSocket} from 'ws';
import {logger} from "../../framework/Logger";

export class ConnectionHandler {
    private readonly CONFIG_PATH_MAX_CONNECTIONS = 'EULER_CONNECTIONS_MAX';
    private readonly CONFIG_PATH_ALLOWED_RETRIES = 'EULER_RETRY_AMOUNT';
    private readonly CONFIG_PATH_EULER_API_KEY = 'EULER_API_KEY';

    private readonly maxConnections: number = 1;
    private readonly allowedRetryAttempts: number = 5;
    private totalConnections: number = 0;
    private readonly connections: Record<string, WebSocket|null> = {};
    private readonly connectionHeartbeats: Record<string, any> = {};
    private readonly expectedToClose: Record<string, boolean> = {};
    private readonly openRetries: Record<string, number> = {};

    constructor() {
        const configuredMaxConnections = configManager.get(this.CONFIG_PATH_MAX_CONNECTIONS, 1);
        this.maxConnections = typeof configuredMaxConnections === 'string' ? parseInt(configuredMaxConnections) : configuredMaxConnections;

        const allowedRetryAttempts = configManager.get(this.CONFIG_PATH_ALLOWED_RETRIES, 5);
        this.allowedRetryAttempts = typeof allowedRetryAttempts === 'string' ? parseInt(allowedRetryAttempts) : allowedRetryAttempts;
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
            this.expectedToClose[normalizedUsername] = false;
            this.openRetries[normalizedUsername] = 0;
            this.connect(normalizedUsername);
        } else {
            logger.info(`Euler FC Connection Handler is returning existing WebSocket connection for ${normalizedUsername}`);
        }

        return this.connections[normalizedUsername];
    }

    private async connect(normalizedUsername: string): Promise<void> {
        logger.info(`Initializing new Euler FC Websocket for ${normalizedUsername}`);
        const endpointUrl = this.getEndpointUrl(configManager.get(this.CONFIG_PATH_EULER_API_KEY), normalizedUsername);
        logger.debug(`Connection to FC Endpoint: ${endpointUrl}`)
        this.connections[normalizedUsername] = <WebSocket>new WebSocket(endpointUrl);

        this.createCleanupEventsForWebsocket(normalizedUsername);
        this.addWebsocketMessageDebugLogging(normalizedUsername);
    }

    private close(normalizedUsername: string) {
        this.expectedToClose[normalizedUsername] = true;
        this.connections[normalizedUsername].close();
    }

    private normalizerUsername(username: string): string {
        return username.toLowerCase();
    }

    private createCleanupEventsForWebsocket(normalizedUsername: string): void {
        const socket = this.connections[normalizedUsername];

        this.connectionHeartbeats[normalizedUsername] = setInterval(() => {
            socket.send('ping');
        }, 5000);

        socket.on('close', () => {
            if (!this.expectedToClose[normalizedUsername] && this.openRetries[normalizedUsername] < this.allowedRetryAttempts) {
                ++this.openRetries[normalizedUsername];
                this.connect(normalizedUsername);
                return;
            }
            logger.info(`Euler FC WebSocket for ${normalizedUsername} has closed`);
            clearInterval(this.connectionHeartbeats[normalizedUsername]);
            delete this.connections[normalizedUsername];
            delete this.openRetries[normalizedUsername];
            delete this.expectedToClose[normalizedUsername];
            --this.totalConnections;
        });
        socket.on('message', (rawMessage: string) => {
            const message = JSON.parse(rawMessage);
            if (typeof message.type !== 'undefined' && message.type === 'tiktok_event' && message.name === 'DisconnectEvent') {
                logger.info(`Received DisconnectEvent for Euler FC WebSocket for ${normalizedUsername}`);
                this.expectedToClose[normalizedUsername] = true;
                this.close(normalizedUsername);
            }
        });
        socket.on('error', (error) => {
            logger.warn('Euler FC WebSocket Error', error);
            try {
                logger.info(`Attempting to close Euler FC Socket for ${normalizedUsername}`);
                this.close(normalizedUsername);
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
            this.close(username);
        }
    }
}

const connectionHandler = new ConnectionHandler();

export {connectionHandler};