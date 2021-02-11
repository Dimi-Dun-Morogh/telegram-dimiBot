import { textToEmoji } from '../../helpers/textConverters';
import { IusersStat, IwordStat, InewMessage } from '../../interfaces/chats&messages';

const messageStats = {

  userStats(messages: Array<InewMessage>) {
    const userStat = this.countMsgsForEachUser(messages);
    let strResult = `${textToEmoji('lightning')}Топ 10 зяблов${textToEmoji('lightning')} по кол-ву сообщений${textToEmoji('speech')} : \n`;

    // filter userStat to have only 10 indexes and sort by msg count
    Object.entries(userStat)
      .sort((a, b) => b[1].count - a[1].count)
      .filter((word, index) => index < 10)
      .forEach(([, { userName, name, count }]) => (strResult += `${textToEmoji('pin')} ${name !== undefined ? name : userName} ${textToEmoji('boom')} ${count}\n`));
    return strResult;
  },

  wordStats(messages: Array<InewMessage>) {
    const wordStat = this.countMostUsedWords(messages);

    let strResult = `${textToEmoji('lightning')} Топ ${textToEmoji(10)} слов: \n`;

    // filter wordStat to have only 10 indexes and sort by most used;
    Object.entries(wordStat)
      .sort((a, b) => b[1] - a[1])
      .filter((word, index) => index < 10)
      .forEach(([word, count]) => (strResult += `${textToEmoji('pin2')} ${word} : ${count}\n`));
    return strResult;
  },

  countMsgsForEachUser(msgArray: Array<InewMessage>): IusersStat {
    const countMsgs = msgArray.reduce((acc: any, { user_id }) => {
      acc[user_id] = acc[user_id] + 1 || 1;
      return acc;
    }, {});
    msgArray.forEach(({ userName, name, user_id }) => {
      countMsgs[user_id] = {
        userName,
        name,
        count: countMsgs[user_id].count || countMsgs[user_id],
        user_id,
      };
    });
    return countMsgs;
  },

  countMostUsedWords: (msgArray: Array<InewMessage>): IwordStat => msgArray.reduce((acc: any, { text = '' }) => {
    // удалим \n .replaceAll('\n', ' ') и ,!.
    const words = text
      .replace(/\n/g, ' ')
      .replace(/[.,?!]/g, '')
      .split(' ');
    words.forEach((word) => {
      const wordLc = word.toLowerCase();
      if (word.length > 2) acc[wordLc] = acc[wordLc] + 1 || 1;
    });
    return acc;
  }, {}),
};

export { messageStats };
