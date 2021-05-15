if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const telegramConfig = {
  botApiKey: process.env.tg_bot_token,
  weatherApiKey: process.env.weather_app_token
};

export default telegramConfig;
