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

    let strResult = `${textToEmoji('lightning')} Топ ${textToEmoji(15)} слов:
     \n`;

    Object.entries(wordStat)
      .filter((word, index) => index < 15)
      .forEach(([word, count]) => (strResult += `${textToEmoji('pin2')} ${textToEmoji(count.count)} - ${word}  :   [ ${count.items.join(', ')} ]\n`));
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

  countMostUsedWords: (msgArray: Array<InewMessage>, wordLength?:number): IwordStat => {
    const daLength = wordLength || 5;
    console.log('1 etap countMostUsedWords');
    const AllMsgs = msgArray.map((msg) => msg.text.toLowerCase()).join(' ')
      .replace(/\n/g, ' ')
      .replace(/[.,?!]/g, '')
      .split(' ')
      .filter((word:string) => {

        return (word.length >= daLength && word.indexOf('http') === -1  && isNaN(+word));
      });
    console.log('2 etap');
    //! соберем ключи
    const keysForStats = AllMsgs.reduce((acc, word:string) => {
      const key = word.slice(0, 5);
      // const key = word;
      acc[key] = { count: 0, items: [] };
      return acc;
    }, {} as IwordStat);


    console.time('3rd step');
    //* 'стати': { count: 2, items: [ 'статистику' ] },
    //* 'время': { count: 2, items: [ 'время' ] },

    AllMsgs.forEach(word=>{
      const key = word.slice(0, 5);
      keysForStats[key].count += 1;
      keysForStats[key].items = [...new Set([...keysForStats[key].items, word])];
    });

    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${used} MB`);
    console.timeEnd('3rd step');


    const sorted = Object.entries(keysForStats).sort((a, b) => b[1].count - a[1].count);

    return Object.fromEntries(sorted);
  },
};

export { messageStats };
