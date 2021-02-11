import { textToEmoji } from '../../helpers/textConverters';
import { InewMessage } from '../../interfaces/chats&messages';
import { messageStats } from './messageStats';

const renderMsg = {
  dictionary: {
    week: `последние ${textToEmoji(7)} дней`,
    month: `последние ${textToEmoji(30)} дней`,
    day: 'день',
    'all time': 'всё время',
  } as { [key: string]: string },

  statsByTimeStr(messages: Array<InewMessage>, timeRange: string) {
    const wordStatString = messageStats.wordStats(messages);
    const userStatString = messageStats.userStats(messages);

    return `${textToEmoji('saintsRow')}Cообщений за ${this.dictionary[timeRange]} - ${textToEmoji(messages.length)}\n
    ${userStatString}\n${textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle')}\n\n${wordStatString}`;
  },

  wordStatsStr(messages: Array<InewMessage>, word:string) {
    const wordStat = messageStats.countMostUsedWords(messages);
    const date = new Date(messages[0].date * 1000);
    const stats = wordStat[word] || 0;
    let varietyStr = '';

    Object.entries(wordStat)
      .filter(([key]) => key.includes(word.toLowerCase()))
      .forEach(([key, value]) => (varietyStr += `\n${key} : ${value} ${textToEmoji('lightning')}`));
    console.log(stats, 'wordstat');

    return `начиная с ${date.toLocaleDateString()} слово ${textToEmoji('pin')}"${word}"${textToEmoji('pin')} было написано ${stats} раз${textToEmoji('boom')}\n включая вариации:\n ${varietyStr}`;
  },

  myStatsStr(messages: Array<InewMessage>) {
    const wordStat = messageStats.wordStats(messages);
    const dateFirstMsg = new Date(messages[0].date * 1000);
    return `статистика для ${textToEmoji('saintsRow')}${messages[messages.length - 1].name}${textToEmoji(
      'saintsRow',
    )} начиная с ${dateFirstMsg.toLocaleDateString()}:\n сообщений ${textToEmoji(messages.length)}\n\n${wordStat}`;
  },

};

export { renderMsg };
