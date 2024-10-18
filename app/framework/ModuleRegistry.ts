import {Module} from "./Module";

class ModuleRegistry {
    modules: Record<string, typeof Module> = {};

    register<T extends typeof Module>(module: T): void {
        const moduleName = module.getModuleName();
        if (this.modules.hasOwnProperty(moduleName)) {
            throw `Module ${moduleName} already registered`;
        }
        this.modules[moduleName] = module;
    }

    get(moduleName: string): typeof Module {
        return this.modules[moduleName];
    }
}

const moduleRegistry = new ModuleRegistry();

export {moduleRegistry};