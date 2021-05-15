const phrases = [
  'Я ПОД СПИКОМ',
  'ДАБ ДАБ Я',
  'ШО',
  'ИЗВИНИСЬ И Я ПОШЕЛ',
  'А...НЮ ДАВАЙ',
  'НЕ ВАЖНО',
  'Та шо там гаварить',
  'Я Пожилой боров (кроль), ветеринар',
  'я тупа пожилая ракета ШО',
  'маасло масло',
  'Шо? Ну шшшо?',
  'Сегодня называйте меня таранчик. Сегодня я пожилой таракашка.',
  'Тупа каловая масса',
  'Я вупсень блядь!',
  'Хай гелс энд хай зяблс',
  'Димой нормального человека не назавут',
  'КАРКУЕМСЯ ВЫПУСКАЕМ ЖАЛЮЗИ',
  'стара вульва',
  'хай герл энд хай зяблс энд хай бэээээби бооон я старый пажилой гандон, кто я гандон? да я',
  'Хто я кролик может быть ты кролик',
];

const emojis = {
  0: '0\ufe0f\u20e3',
  1: '1\ufe0f\u20e3',
  2: '2\ufe0f\u20e3',
  3: '3\ufe0f\u20e3',
  4: '4\ufe0f\u20e3',
  5: '5\ufe0f\u20e3',
  6: '6\ufe0f\u20e3',
  7: '7\ufe0f\u20e3',
  8: '8\ufe0f\u20e3',
  9: '9\ufe0f\u20e3',
  saintsRow: '\u269c\ufe0f',
  info: '\u2139\ufe0f',
  speech: '\ud83d\udcac',
  small_triangle: '\ud83d\udd39',
  lightning: '\u26a1\ufe0f',
  pin: '\ud83d\udccc',
  boom: '\ud83d\udca5',
  pin2: '\ud83e\uddf7',
  green_snowflake: '\u2733\ufe0f',
  ok: '\u2705',
  sun: '\u2600\ufe0f',
  black_moon: '\ud83c\udf1a',
  clock: '\u23f0',

};

const textToEmoji = (val) => {
  const dictionary = emojis;
  let res = '';
  val = String(val);
  if (isNaN(+val)) return dictionary[val];
  if (val === '10') return '\ud83d\udd1f';
  for (let i = 0; i < val.length; i++) {
    res += dictionary[val[i]];
  }
  return res;
};

module.exports = {
  textToEmoji,
  phrases,
  emojis,
};
