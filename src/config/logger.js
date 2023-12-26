
import winston from "winston";
import envConfig from "./env.config.js";

const customOpc = {
    levels: {
        debug:5,
        verbose:4,
        http:3,
        info:2,
        warn:1,
        error:0
    },
    colors:{
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        verbose: "cyan",
        debug: "blue"
    }
}

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customOpc.colors
                    }),
                    winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customOpc.colors
                    }),
                    winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customOpc.colors
                    }),
                    winston.format.simple()
            )
        }),
    ]
});

export const addLogger = (req, res, next) => {
    if(envConfig.enviroment === "dev"){
        req.logger = devLogger;
    }else{
        req.logger = prodLogger;
    }
    next();
}