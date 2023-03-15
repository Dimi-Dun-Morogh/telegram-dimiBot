import express, { Request, Response } from 'express';
import logger from './helpers/loggers';
import { connectDb } from './db/db-connect';
import bot from './bot/bot';
import tgConfig from './config/telegram';

import { cronSayRandom } from './helpers/cronTasks';

import * as dotenv from 'dotenv';
dotenv.config();

const { BotStatusHtml } = require('./helpers/utils');

const NAMESPACE = 'app.ts';
let uptime = '';





const app = express();



app.get('/', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} Ping Received, ${process.env.NODE_ENV}`);
  response.sendStatus(200);
});

app.get('/bot-status', (request: Request, response: Response) => {
  logger.info(NAMESPACE, `${Date.now()} bot-status`);
  response.send(BotStatusHtml(uptime));
});

connectDb().then(() => {
  // app.listen(process.env.PORT || 3111, () => {

  // });
  logger.info(NAMESPACE, 'connect to db success');
  if (process.env.NODE_ENV === 'production') {
    app.use(express.json());
    app.use(bot.webhookCallback('/' + tgConfig.botApiKey));


    bot.telegram.setWebhook(process.env.WEBHOOK_URL!);
    bot.startWebhook('/', null, +process.env.PORT!);
    bot.telegram.webhookReply = false;
    console.log('webhook url - ', process.env.WEBHOOK_URL! + tgConfig.botApiKey, '\n', `PORT IS ${process.env.PORT}`);
    console.log('running webhook mode');


  } else {
    bot
      .launch()
      .then(() => {
        logger.info(NAMESPACE, 'bot up and running in polling');
        uptime = new Date().toLocaleString();
      })
      .catch((error: Error) => console.error(error));
  }
});








cronSayRandom.start();

// epic-games

// setTimeout(() => epicGames.parseGames(), 40000);

// cronEGGiveAway.start();
