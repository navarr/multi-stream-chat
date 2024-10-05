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

    public debug() {
        if (this.level <= LogLevel.DEBUG)
            console.log(...arguments);
    }

    public info() {
        if (this.level <= LogLevel.INFO)
            console.info(...arguments);
    }

    public notice() {
        if (this.level <= LogLevel.NOTICE)
            console.log(...arguments);
    }

    public warn() {
        if (this.level <= LogLevel.WARNING)
            console.warn(...arguments);
    }

    public error() {
        if (this.level <= LogLevel.ERROR)
            console.error(...arguments);
    }

    public critical() {
        if (this.level <= LogLevel.CRITICAL)
            console.error(...arguments);
    }

    public alert() {
        if (this.level <= LogLevel.ALERT)
            console.error(...arguments);
    }

    public emergency() {
        if (this.level <= LogLevel.EMERGENCY)
            console.error(...arguments);
    }
}

const CONFIG_PATH_LOG_LEVEL = 'LOG_LEVEL';
const configuredLogLevel = parseInt(configManager.get(CONFIG_PATH_LOG_LEVEL));
const logLevelToUse = configuredLogLevel > 0 ? configuredLogLevel : LogLevel.DEBUG;

const logger = new Logger(logLevelToUse);

export {logger};