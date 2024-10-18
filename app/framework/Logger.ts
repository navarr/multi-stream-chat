import {configManager} from "./ConfigHandler";
import {config} from "dotenv";

enum LogLevel {
    DEBUG = 100,
    INFO = 200,
    NOTICE = 250,
    WARNING = 300,
    ERROR = 400,
    CRITICAL = 500,
    ALERT = 550,
    EMERGENCY = 600
}

class Logger {
    private readonly level: LogLevel

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        console.debug('Log Level', logLevel);
        this.level = logLevel;
    }

    public debug(...args: any) {
        if (this.level <= LogLevel.DEBUG)
            console.log(...args);
    }

    public info(...args: any) {
        if (this.level <= LogLevel.INFO)
            console.info(...args);
    }

    public notice(...args: any) {
        if (this.level <= LogLevel.NOTICE)
            console.log(...args);
    }

    public warn(...args: any) {
        if (this.level <= LogLevel.WARNING)
            console.warn(...args);
    }

    public error(...args: any) {
        if (this.level <= LogLevel.ERROR)
            console.error(...args);
    }

    public critical(...args: any) {
        if (this.level <= LogLevel.CRITICAL)
            console.error(...args);
    }

    public alert(...args: any) {
        if (this.level <= LogLevel.ALERT)
            console.error(...args);
    }

    public emergency(...args: any) {
        if (this.level <= LogLevel.EMERGENCY)
            console.error(...args);
    }
}

const CONFIG_PATH_LOG_LEVEL = 'LOG_LEVEL';
let configuredLogLevel = configManager.getNumber(CONFIG_PATH_LOG_LEVEL, 0)
const logLevelToUse = configuredLogLevel > 0 ? configuredLogLevel : LogLevel.DEBUG;

const logger = new Logger(logLevelToUse);

export {logger};