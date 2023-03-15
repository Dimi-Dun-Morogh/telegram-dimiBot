import { CommandsObj } from '../../interfaces/types';

const COMMANDS : CommandsObj = {
  INFO: [/^бот инфа\W+/g, /^Бот инфа\W+/g, /^Бот инфо\W+/g, /^бот инфо\W+/g, /^инфо\W+/g, /^инфа\W+/g, /^Инфо\W+/g, /^Инфа\W+/g],

  WHEN: [/^бот когда\W+/g, /^Бот когда\W+/g, /^когда\W+/g, /^Когда\W+/g],

  WEATHER: [/^бот погода\W+/g, /^Бот погода\W+/g, /^погода\W+/g, /^Погода\W+/g],

  RANDOM_REPLY: ['да', 'Да', 'ДА', 'нет', 'Нет', 'НЕТ', 'незнаю', 'не знаю', 'Че', 'че', 'ЧЕ', 'мяу', 'МЯУ', 'мур', 'МУР'],

};

export default COMMANDS;