import winston from 'winston';

const Logger = winston.createLogger({
    transports: [
        // Console transport for logging to the console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.uncolorize({
                    level: true,
                    message: true,
                    raw: true,
                }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                // Customize the log message format
                winston.format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        }),
        // File transport for logging to a file
        new winston.transports.File({
            // Specify the filename and location for the log file
            filename: '../logs/execution.log',
            format: winston.format.combine(
                winston.format.uncolorize({
                    level: true,
                    message: true,
                    raw: true,
                }),
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.align(),
                winston.format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`
                )
            ),
        }),
    ],
});

export default Logger;
