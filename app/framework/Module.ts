export interface Module {
    moduleName: string

    initialize(): void;
    shutdown(): void;
}