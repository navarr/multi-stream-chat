import * as fs from "node:fs";
import {configManager} from "./framework/ConfigHandler";
import {moduleRegistry} from "./framework/ModuleRegistry";
import {logger} from "./framework/Logger";

(async () => {
    const moduleLoadPaths = configManager.get('MODULE_LOADPATHS', '').split(',');
    for (let i in moduleLoadPaths) {
        const loadPath = moduleLoadPaths[i];
        const moduleDirectories = fs.readdirSync(loadPath, {withFileTypes: true});
        for (let j in moduleDirectories) {
            const moduleDirectory = moduleDirectories[j];

            if (moduleDirectory.isDirectory()) {
                try {
                    await import(loadPath + '/' + moduleDirectory.name + '/module.ts');
                    logger.debug(`Successfully loaded in ${loadPath}/${moduleDirectory.name}/module`);
                } catch (e) {
                    logger.info(`Attempted to load ${moduleDirectory.name} from ${loadPath}/${moduleDirectory.name}/module but failed`, e)
                }
            }
        }
    }

    const modules = [];

    const modulesToLoad = configManager.get('MODULES', '').split(',');
    modulesToLoad.forEach((moduleName) => {
        const moduleType = moduleRegistry.get(moduleName);
        if (moduleType === undefined) {
            logger.warn(`Could not load module of type ${moduleName}`);
            return;
        }
        // @ts-ignore
        modules.push(new moduleType);
    })

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
})();