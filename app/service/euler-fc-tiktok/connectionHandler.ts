import {configManager} from "../../framework/ConfigHandler";

class ConnectionHandler {
    private CONFIG_PATH_MAX_CONNECTIONS = 'EULER_CONNECTIONS_MAX';

    private maxConnections: number = 1;
    private totalConnections: number = 0;
    private connections: Record<string, WebSocket> = {};

    constructor() {
        const configuredMaxConnections = configManager.get(this.CONFIG_PATH_MAX_CONNECTIONS);
        if (configuredMaxConnections) {
            this.maxConnections = parseInt(configuredMaxConnections);
        }
    }
}