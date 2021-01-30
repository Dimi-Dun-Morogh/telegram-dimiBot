import express, { Request, Response } from 'express';
import logger from './helpers/loggers';
import { connectDb } from './db/db-connect';

import bot from './bot/bot';

import wakeUpDyno from './helpers/herokuAntiIdle';

import { cronSayRandom } from './helpers/cronTasks';

const NAMESPACE = 'app.ts';
connectDb().then(() => logger.info(NAMESPACE, 'connect to db success'));
bot
  .launch()
  .then(() => logger.info(NAMESPACE, 'bot up and running'))
  .catch((error: Error) => console.error(error));

// bot.stop();
// anti idle conspiracy
const URL = 'https://dimi-tg.herokuapp.com/';
const app = express();

wakeUpDyno(URL);

app.get('/', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} Ping Received`);
  response.sendStatus(200);
});
app.listen(process.env.PORT, () => {
  wakeUpDyno(URL);
});

cronSayRandom.start();
