/**
 * Common utility functionality.
 */
import { createLogger, Logger, format, transports } from 'winston';

/**
 * Get a logger to use.
 * 
 * The logger is for the console, includes timestamps, the module name and coloured log levels.
 * 
 * @param name      The name of the module
 * @param logLevel  The log level to set (silly, debug, info, warning, error)
 */
export function getLogger(name: string, logLevel: string): Logger {
    const logger = createLogger({
        level: logLevel,
        format: format.combine(
            format.label({ label: name }),
            format.timestamp(),
            format.splat(),
            format.simple()
        ),
        transports: [ new transports.Console() ]
    });

    return logger;
}
