import {env} from 'node:process';

require('dotenv').config();

export interface ConfigManager {
    get<T>(configPath: string, defaultValue?: T): string | T | null;
    getNumber(configPath: string, defaultValue?: number): number|null;
    getBoolean(configPath: string, defaultValue?: boolean): boolean;
}

class EnvConfigManager implements ConfigManager {
    get<T>(configPath: string, defaultValue: T = null): string | T | null {
        return env[configPath] ?? defaultValue ?? null;
    }

    getNumber(configPath: string, defaultValue?: number): number|null {
        let result = this.get(configPath, null);
        return result !== null ? parseInt(result) : defaultValue ?? null;
    }

    getBoolean(configPath: string, defaultValue: boolean = false): boolean {
        let result = this.get(configPath, null);
        if(!result) return defaultValue;
        result = result.toLowerCase();

        return result === '1' || result === 'y' || result === 'yes' || result === 'on';
    }
}

const configManager = new EnvConfigManager();

export { configManager };