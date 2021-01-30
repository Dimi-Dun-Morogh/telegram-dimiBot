"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const telegramConfig = {
    botApiKey: process.env.tg_bot_token,
};
exports.default = telegramConfig;
