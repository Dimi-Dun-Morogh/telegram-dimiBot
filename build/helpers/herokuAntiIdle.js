"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = __importDefault(require("./loggers"));
const fetch = require('node-fetch');
const NAMESPACE = 'antiIdle.js';
const wakeUpDyno = (url, interval = 25, callback) => {
    const milliseconds = interval * 60000;
    setTimeout(() => {
        try {
            loggers_1.default.info(NAMESPACE, 'wakeUpDyno settimeout called');
            fetch(url).then(() => console.log(`Fetching ${url}.`));
        }
        catch (err) {
            console.log(`Error fetching ${url}: ${err.message}
          Will try again in ${interval} minutes...`);
        }
        finally {
            try {
                if (!callback)
                    return null;
                callback();
            }
            catch (e) {
                console.log('Callback failed: ', e.message);
            }
            finally {
                return wakeUpDyno(url, interval, callback);
            }
        }
    }, milliseconds);
};
exports.default = wakeUpDyno;
