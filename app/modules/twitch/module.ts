import {Module} from "../../framework/Module";
import {moduleRegistry} from "../../framework/ModuleRegistry";

class TwitchInitializer extends Module {
    public static MODULE_NAME: string = "twitch";

    public static getModuleName(): string {
        return TwitchInitializer.MODULE_NAME;
    }

    initialize(config: any): void {
    }

    shutdown(): void {
    }
}

moduleRegistry.register(TwitchInitializer);