import express, { Request, Response } from 'express';
import logger from './helpers/loggers';
import { connectDb } from './db/db-connect';
import bot from './bot/bot';

import wakeUpDyno from './helpers/herokuAntiIdle';

import { cronSayRandom } from './helpers/cronTasks';

const { BotStatusHtml } = require('./helpers/utils');

const NAMESPACE = 'app.ts';
let uptime = '';

connectDb().then(() => logger.info(NAMESPACE, 'connect to db success'));
bot
  .launch()
  .then(() => {
    logger.info(NAMESPACE, 'bot up and running');
    uptime = new Date().toLocaleString();
  })
  .catch((error: Error) => console.error(error));

// anti idle conspiracy
const URL = 'https://dimi-tg.herokuapp.com/';
const app = express();

wakeUpDyno(URL);

app.get('/', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} Ping Received`);
  response.sendStatus(200);
});

app.get('/bot-status', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} bot-status`);
  response.send(BotStatusHtml(uptime));
});

app.listen(process.env.PORT || 3111, () => {
  wakeUpDyno(URL);
});

cronSayRandom.start();

// epic-games

// setTimeout(() => epicGames.parseGames(), 40000);

// cronEGGiveAway.start();
