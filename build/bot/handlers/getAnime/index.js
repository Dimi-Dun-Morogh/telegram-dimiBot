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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = __importDefault(require("../../../helpers/loggers"));
const fetch = require('node-fetch');
const { textToEmoji } = require('../../../helpers/textConverters');
const animeIDs = require('../../../mocks/animeIds.json');
const NAMESPACE = 'getAnime/index.js';
const getRandomAnime = () => __awaiter(void 0, void 0, void 0, function* () {
    const randomId = animeIDs[Math.floor(Math.random() * animeIDs.length)];
    const result = yield fetch(`https://api.jikan.moe/v3/anime/${randomId}`).then((res) => res.json());
    const { title, url, image_url, trailer_url, status, duration, rating, synopsis, genres, aired: { string }, episodes, } = result;
    const animeObj = {
        title,
        url,
        image_url,
        trailer_url,
        status,
        duration,
        rating,
        synopsis,
        genres,
        aired: { string },
        episodes,
    };
    return animeObj;
});
const translate = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!text)
            return 'no text';
        const translated = yield fetch('https://fasttranslator.herokuapp.com/api/v1/text/to/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: text,
                lang: 'en-ru',
                as: 'json',
            }),
        }).then((res) => res.json());
        return translated.data;
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error translating ${error.message}`, error);
    }
});
const renderAnimeStr = (animeObj) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, rating, synopsis, genres, aired, trailer_url, duration, episodes } = animeObj;
    const synopsisRu = yield translate(synopsis);
    const pin = textToEmoji('pin');
    const lightning = textToEmoji('lightning');
    const sr = textToEmoji('saintsRow');
    const speech = textToEmoji('speech');
    const genresStr = genres ? genres.reduce((acc, { type, name }) => (acc += `[${type} : ${name}] `), '') : false;
    const text = `${pin}название${pin}: ${title} \n${aired.string ? `${lightning}дата выхода${lightning}: ${aired.string}` : null}\n\nдлительность: ${duration}\n\nкол-во серий:${episodes}\n\n${speech}краткий обзор${speech}:  ${synopsisRu || synopsis} \n\n${sr}возрастной рейтинг${sr}: ${rating}\n${genresStr ? `жанры: ${genresStr}` : ''}\n${trailer_url ? `${pin} ${trailer_url}` : ''}`;
    return text;
});
const handleAnime = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const anime = yield getRandomAnime();
    const text = yield renderAnimeStr(anime);
    if (anime.image_url)
        yield ctx.replyWithPhoto(anime.image_url);
    ctx.reply(text);
    loggers_1.default.info(NAMESPACE, 'отвечаем рандомным аниме', text);
});
module.exports = handleAnime;
