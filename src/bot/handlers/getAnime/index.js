const fetch = require('node-fetch');
const logger = require('../../../helpers/loggers');
const { textToEmoji } = require('../../../helpers/textConverters');
const animeIDs = require('../../../mocks/animeIds.json');

const NAMESPACE = 'getAnime/index.js';

const getRandomAnime = async () => {
  const randomId = animeIDs[Math.floor(Math.random() * animeIDs.length)];
  const result = await fetch(`https://api.jikan.moe/v3/anime/${randomId}`).then((res) =>
    res.json(),
  );
  const {
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
  } = result;
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
  // console.log(result);
  // console.log(animeObj);
  return animeObj;
};

const translate = async (text) => {
  try {
    if (!text) return 'no text';
    const translated = await fetch(`https://fasttranslator.herokuapp.com/api/v1/text/to/text`, {
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
  } catch (error) {
    logger.info(NAMESPACE, 'error translating');
  }
};

const renderAnimeStr = async (animeObj) => {
  const { title, rating, synopsis, genres, aired, trailer_url, duration, episodes } = animeObj;
  const synopsisRu = await translate(synopsis);
  const pin = textToEmoji('pin');
  const lightning = textToEmoji('lightning');
  const sr = textToEmoji('saintsRow');
  const speech = textToEmoji('speech');
  const genresStr = genres
    ? genres.reduce((acc, { type, name }) => (acc += `[${type} : ${name}] `), '')
    : false;
  const text = `${pin}название${pin}: ${title} \n${
    aired.string ? `${lightning}дата выхода${lightning}: ${aired.string}` : null
  }\n\nдлительность: ${duration}\n\nкол-во серий:${episodes}\n\n${speech}краткий обзор${speech}:  ${
    synopsisRu || synopsis
  } \n\n${sr}возрастной рейтинг${sr}: ${rating}\n${genresStr ? `жанры: ${genresStr}` : ''}\n${
    trailer_url ? `${pin} ${trailer_url}` : ''
  }`;
  return text;
};

const handleAnime = async (ctx) => {
  const anime = await getRandomAnime();
  const text = await renderAnimeStr(anime);
  if (anime.image_url) await ctx.replyWithPhoto(anime.image_url);
  ctx.reply(text);
  logger.info(NAMESPACE, 'отвечаем рандомным аниме', text);
};

module.exports = handleAnime;
