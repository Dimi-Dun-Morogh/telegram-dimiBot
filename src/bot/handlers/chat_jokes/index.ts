import { TelegrafContext } from 'telegraf/typings/context';

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const he = require('he');
// he for decoding html entities
const { textToEmoji } = require('../../../helpers/textConverters');

export async function parseJokes(context: TelegrafContext) {
  try {
    const { first_name, last_name, username } = context.message!.from!;
    const userStr = `${!first_name ? username : first_name} ${!last_name ? '' : last_name}`;
    const data = await fetch('https://www.anekdot.ru/random/anekdot/').then((response: any) => response.text());
    const $ = cheerio.load(data);
    const allJokes = $('.text')
      .first()
      .html()
      .replace(/<(?:.|\n)*?>/gm, '\n'); // remove all html tags;
    const joke = he.decode(allJokes);
    const date = $('.title').first().first().text();
    context.reply(`Анекдот для ${textToEmoji('boom')}${userStr}${textToEmoji('boom')}\n\n${joke}\n\n${date}`);
  } catch (error) {
    console.log(error.message, 'err joke');
  }
}
