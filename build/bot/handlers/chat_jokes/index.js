"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJokes = void 0;
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const he = require('he');
const { textToEmoji } = require('../../../helpers/textConverters');
function parseJokes(context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { first_name, last_name, username } = context.message.from;
            const userStr = `${!first_name ? username : first_name} ${!last_name ? '' : last_name}`;
            const data = yield fetch('https://www.anekdot.ru/random/anekdot/').then((response) => response.text());
            const $ = cheerio.load(data);
            const allJokes = $('.text')
                .first()
                .html()
                .replace(/<(?:.|\n)*?>/gm, '\n');
            const joke = he.decode(allJokes);
            const date = $('.title').first().first().text();
            context.reply(`Анекдот для ${textToEmoji('boom')}${userStr}${textToEmoji('boom')}\n\n${joke}\n\n${date}`);
        }
        catch (error) {
            console.log(error.message, 'err joke');
        }
    });
}
exports.parseJokes = parseJokes;
