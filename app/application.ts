import {TiktokInitializer} from "./service/euler-fc-tiktok/initializer";
import {ConsoleClient} from "./client/console";

// TODO Determine how to load these via configuration
const modules = [
    new ConsoleClient(),
    new TiktokInitializer()
]

modules.forEach((module) => module.initialize());

// Finally, register shutdown scripts
let shuttingDown = false;
function shutdown() {
    if (!shuttingDown) {
        shuttingDown = true;
        modules.forEach((module) => module.shutdown());
    }
}

process.on('SIGINT', shutdown);
process.on('SIGQUIT', shutdown);
process.on('SIGTERM', shutdown);