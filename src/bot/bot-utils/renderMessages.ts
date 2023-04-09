import { textToEmoji, emojis } from '../../helpers/textConverters';
import { InewMessage } from '../../interfaces/chats&messages';
import { ISerialized } from '../../interfaces/weatherData';
import { messageStats } from './messageStats';

const { formatDate } = require('../../helpers/utils');

const {
  pin, green_snowflake, sun, black_moon, clock, saintsRow, small_triangle,
} = emojis;

const myStatsStr = (messages: Array<InewMessage>) => {
  const wordStat = messageStats.wordStats(messages);

  const dateFirstMsg = new Date(messages[0].date * 1000);
  return `статистика для ${textToEmoji('saintsRow')}${messages[messages.length - 1].name}${textToEmoji(
    'saintsRow',
  )} начиная с ${dateFirstMsg.toLocaleDateString()}:\n сообщений ${textToEmoji(messages.length)}\n\n${wordStat}`;
};

const wordStatsStr = (messages: InewMessage[], word:string) => {
  const wordStat = messageStats.countMostUsedWords(messages, word.length);
  const date = new Date(messages[0].date * 1000);
  const stats = wordStat[word]?.count || 0;
  let varietyStr = '';

  Object.entries(wordStat)
    .filter(([key]) => key.includes(word.toLowerCase()))
    .forEach(([key, value]) => (varietyStr += `\n${key} : ${value.count} -  ${value.items.join(', ')} ${textToEmoji('lightning')}`));

  return `начиная с ${date.toLocaleDateString()} слово ${pin}"${word}"${pin} было написано ${stats} раз${textToEmoji('boom')}\n а так же вариации:\n ${varietyStr}`;
};

const weatherString = (obj: ISerialized) => {
  const { weather_today, city } = obj;
  const {
    name, population, sunrise, sunset,
  } = city;

  const weatherStats = Object.values(weather_today).reduce((acc, dayCut) => {
    const { time, main: { temp }, weather } = dayCut;
    let newAcc = acc;
    const res = `${clock} ${time}      ${temp > 0 ? `+${temp}` : temp}, ${weather ? weather[0].description : ''}${saintsRow}\n`;
    newAcc += res;
    return newAcc;
  }, '');
  return `${green_snowflake}Погода${green_snowflake} сегодня в ${pin + name + pin}:\n
${weatherStats}
население: ${population}; ${black_moon}заход солнца: ${formatDate(sunset)}; ${sun}рассвет: ${formatDate(sunrise)}
  `;
};

const giveAway = (obj: { [key:string]: { [key:string]: string } }) => {
  const games = Object.entries(obj).reduce((acc, [title, { date, link }]) => {
    const res = `${textToEmoji('pin')}${title} : ${date}\nссылка - ${link}\n`;
    let newAcc = acc;
    return newAcc += res;
  }, '');
  return `${textToEmoji('saintsRow')}Текущие раздачи в Epic Games${textToEmoji('saintsRow')}:\n\n${games}`;
};

class RenderMsg {
  readonly dictionary = {
    week: `последние ${textToEmoji(7)} дней`,
    month: `последние ${textToEmoji(30)} дней`,
    day: 'день',
    'all time': 'всё время',
  } as { [key: string]: string };

  statsByTimeStr(messages: InewMessage[], timeRange: string) {
    const wordStatString = messageStats.wordStats(messages);
    const userStatString = messageStats.userStats(messages);

    return `${saintsRow}Cообщений за ${this.dictionary[timeRange]} - ${textToEmoji(messages.length)}\n
    ${userStatString}\n${small_triangle + small_triangle + small_triangle + small_triangle}\n\n${wordStatString}`;
  }

  wordStatsStr = wordStatsStr;

  myStatsStr = myStatsStr;

  giveAway = giveAway;

  weatherString = weatherString;
}

const renderMsg = new RenderMsg();

export { renderMsg };
