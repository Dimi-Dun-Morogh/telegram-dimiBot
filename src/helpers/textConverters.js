const textToEmoji = (val) => {
  const dictionary = {
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
  };
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
};
