const winston = require('winston');
const path = require('path');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({
            label: 'mp_telegram_bot'
        }),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'label']
        }),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({ filename: './logs/debug.log', level: 'debug' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    const consoleLogFormat = winston.format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            consoleLogFormat
        ),
        level: 'debug'
    }));
}

exports.logger = logger;