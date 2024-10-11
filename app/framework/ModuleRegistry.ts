import {Module} from "./Module";

interface ModuleConstructor<T extends Module> {
    new(): T;
}

class ModuleRegistry {
    modules: Record<string, Module> = {};

    register<T extends Module>(module: ModuleConstructor<T>): void {
        const moduleName = module.getModuleName();
        if (this.modules.hasOwnProperty(moduleName)) {
            throw `Module ${moduleName} already registered`;
        }
        this.modules[moduleName] = module;
    }

    get(moduleName: string): Module|undefined {
        return this.modules[moduleName];
    }
}

const moduleRegistry = new ModuleRegistry();

export {moduleRegistry};