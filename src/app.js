const bot = require('./bot/bot');
const connectDb = require('./db/db-connect');

connectDb().then(() => console.log('connect to db success'));
bot.launch().then(() => console.log('bot up and running'));
