const express = require('express');
const bot = require('./bot/bot');
const connectDb = require('./db/db-connect');
const wakeUpDyno = require('./helpers/herokuAntiIdle');

connectDb().then(() => console.log('connect to db success'));
bot
  .launch()
  .then(() => console.log('bot up and running'))
  .catch((error) => Promise.reject(error));

// bot.stop();
// anti idle conspiracy
const URL = 'https://dimi-tg.herokuapp.com/';
const app = express();
app.get('/', (request, response) => {
  console.log(`${Date.now()} Ping Received`);
  response.sendStatus(200);
});
app.listen(process.env.PORT, () => {
  wakeUpDyno(URL);
});
