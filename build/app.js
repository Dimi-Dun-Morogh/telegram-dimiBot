"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = __importDefault(require("./helpers/loggers"));
const express = require('express');
const bot = require('./bot/bot');
const connectDb = require('./db/db-connect');
const wakeUpDyno = require('./helpers/herokuAntiIdle');
const { cronSayRandom } = require('./helpers/cronTasks');
const NAMESPACE = 'app.ts';
connectDb().then(() => loggers_1.default.info(NAMESPACE, 'connect to db success'));
bot
    .launch()
    .then(() => loggers_1.default.info(NAMESPACE, 'bot up and running'))
    .catch((error) => console.error(error));
const URL = 'https://dimi-tg.herokuapp.com/';
const app = express();
wakeUpDyno(URL);
app.get('/', (request, response) => {
    loggers_1.default.info(NAMESPACE, `${Date.now()} Ping Received`);
    response.sendStatus(200);
});
app.listen(process.env.PORT, () => {
    wakeUpDyno(URL);
});
cronSayRandom.start();
