import { join } from "path";
import winston = require("winston");

const { format } = winston;
const {
    combine,
    timestamp,
    label,
    prettyPrint,
    colorize,
    json,
    uncolorize,
} = format;

export class Logger {
    /**
     * Create a Bunyan Command logger.
     */
    static create(name: string): winston.Logger {
        return winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: combine(
                        winston.format.simple(),
                        colorize({ all: true }),
                        label({ label: name })
                    ),
                }),
                new winston.transports.File({
                    filename: join("logs", name + ".log"),
                    format: combine(
                        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                        json()
                    ),
                }),
            ],
        });
    }
}
