import { TelegrafContext } from 'telegraf/typings/context';
import logger from '../../../helpers/loggers';
import config from '../../../config/telegram';
import { ISerialized, WeatherResponse } from '../../../interfaces/weatherData';
import { renderMsg } from '../../bot-utils/renderMessages';

const fetch = require('node-fetch');

const NAMESPACE = 'handlers/weather';

const serializeWeatherData = (respData: WeatherResponse) => {
  const data:any = {};
  const { list, city } = respData;

  list!.forEach((item) => {
    const day = { ...item };
    const date = day.dt_txt.split(' ')[0];
    const time = day.dt_txt.split(' ')[1].slice(0, 5);
    let temp = String(day.main.temp);

    temp = temp.slice(0, 2);
    day.main.temp = +temp;

    if (data[date] === undefined) {
      data[date] = {};
    }
    data[date][day.dt_txt] = {
      ...day,
      time,
    };
  });

  return {
    weather_today: Object.values(data)[0],
    city,
  } as ISerialized;
};

const getWeather = async (city:string) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&lang=ru&cnt=8&units=metric&appid=${config.weatherApiKey}`;
    console.log(url, 'url');
    const data: WeatherResponse = await fetch(url).then((dataJson :any) => dataJson.json());
    if (data.cod === '404') return false;
    const serialized: ISerialized = serializeWeatherData(data);
    console.log(serialized);
    return serialized;
  } catch (error) {
    logger.error(NAMESPACE, 'error fetching weather', error);
  }
};

const handleWeather = async (ctx: TelegrafContext) => {
  const { message_id, text } = ctx.message!;
  const messageText = text?.split(' ');
  const msgStr = messageText![0].toLowerCase() === 'бот' ? messageText?.slice(2).join(' ')
    : messageText?.slice(1).join(' ');
  const weatherData = await getWeather(msgStr!);
  if (!weatherData) return ctx.reply('чет ты не то мне пишешь другалёк', { reply_to_message_id: message_id });
  const replyStr = renderMsg.weatherString(weatherData!);
  console.log(msgStr, replyStr);
  ctx.reply(replyStr, { reply_to_message_id: message_id });
};

export default handleWeather;
