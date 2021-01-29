"use strict";
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const telegramConfig = {
    botApiKey: process.env.tg_bot_token,
};
module.exports = telegramConfig;
