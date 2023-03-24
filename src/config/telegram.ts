if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const telegramConfig = {
  botApiKey: process.env.NODE_ENV === 'production' ? process.env.tg_bot_token : process.env.dev_bot_token,
  weatherApiKey: process.env.weather_app_token,
};

export default telegramConfig;
