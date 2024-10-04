import {Module} from "../../framework/Module";

/**
 * This class is responsible for initializing the TikTok module
 */
export class TiktokInitializer implements Module {
    moduleName: string = "TikTok";

    initialize(): void {
        // Create Connection Handler
        // Add Listener for Admin-triggered events
        // Send Events to EventBus
    }

    shutdown(): void {

    }
}