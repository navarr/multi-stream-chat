type AbstractModuleConstructor = typeof Module;
export interface ModuleConstructor extends AbstractModuleConstructor {
    getModuleName(): string;
    new(): Module;
}

export abstract class Module {
    abstract initialize(config: any): void;
    abstract shutdown(): void;

    public static getModuleName(): string {
        throw new Error('Module must define a moduleName');
    }
}