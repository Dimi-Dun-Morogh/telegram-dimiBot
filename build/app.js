"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loggers_1 = __importDefault(require("./helpers/loggers"));
const db_connect_1 = require("./db/db-connect");
const bot_1 = __importDefault(require("./bot/bot"));
const herokuAntiIdle_1 = __importDefault(require("./helpers/herokuAntiIdle"));
const cronTasks_1 = require("./helpers/cronTasks");
const NAMESPACE = 'app.ts';
db_connect_1.connectDb().then(() => loggers_1.default.info(NAMESPACE, 'connect to db success'));
bot_1.default
    .launch()
    .then(() => loggers_1.default.info(NAMESPACE, 'bot up and running'))
    .catch((error) => console.error(error));
const URL = 'https://dimi-tg.herokuapp.com/';
const app = express_1.default();
herokuAntiIdle_1.default(URL);
app.get('/', (request, response) => {
    loggers_1.default.info(NAMESPACE, `${Date.now()} Ping Received`);
    response.sendStatus(200);
});
app.listen(process.env.PORT, () => {
    herokuAntiIdle_1.default(URL);
});
cronTasks_1.cronSayRandom.start();
