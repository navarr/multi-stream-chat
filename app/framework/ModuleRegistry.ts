import {ModuleConstructor} from "./Module";

class ModuleRegistry {
    modules: Record<string, ModuleConstructor> = {};

    register<T extends ModuleConstructor>(module: T): void {
        const moduleName = module.getModuleName();
        if (this.modules.hasOwnProperty(moduleName)) {
            throw `Module ${moduleName} already registered`;
        }
        this.modules[moduleName] = module;
    }

    get(moduleName: string): ModuleConstructor {
        return this.modules[moduleName];
    }
}

const moduleRegistry = new ModuleRegistry();

export {moduleRegistry};