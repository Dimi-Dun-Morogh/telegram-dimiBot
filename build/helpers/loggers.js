"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = {
    getTimeStamp: () => new Date().toLocaleTimeString('en-GB', {
        hour12: false,
    }),
    info(namespace, message, object) {
        console.log(`${this.getTimeStamp()} [${namespace}] [${message}]`, object || '');
    },
};
exports.default = logger;
