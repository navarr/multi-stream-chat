import {env} from 'node:process';

require('dotenv').config();

export interface ConfigManager {
    get<T>(configPath: string, defaultValue?: T): string | T | null;
}

class EnvConfigManager implements ConfigManager {
    get<T>(configPath: string, defaultValue: T = null): string | T | null {
        return env[configPath] ?? defaultValue ?? null;
    }
}

const configManager = new EnvConfigManager();

export { configManager };