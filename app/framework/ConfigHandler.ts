import {env} from 'node:process';

require('dotenv').config();

export interface ConfigManager {
    get(configPath: string): string | null;
}

class EnvConfigManager implements ConfigManager {
    get(configPath: string): string | null {
        return env[configPath] ?? null;
    }
}

const configManager = new EnvConfigManager();

export { configManager };