import logger from '../../../helpers/loggers';

const puppeteer = require('puppeteer');

const NAMESPACE = 'giveAway.ts';

const epicGames = {
  games: {},
  async parseGames() {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process', // <- this one doesn't works in Windows
          '--disable-gpu',
        ],
      });
      const page = await browser.newPage();
      await page.goto('https://www.epicgames.com/store/ru/free-games', { waitUntil: 'networkidle2' });

      logger.info(NAMESPACE, 'start evaluate javascript');

      const parsedGames = await page.evaluate(() => {
        const allSpans = document.querySelectorAll('span');
        const spansNeeded:Array<any> = [];
        allSpans.forEach((elem) => {
          if (elem.textContent!.includes('Бесплатно до') || elem.textContent!.includes('Бесплатно с')) spansNeeded.push(elem);
        });
        const filtered = [...spansNeeded].filter((item) => item.dataset.component !== 'Message');
        console.log(filtered);
        const final = filtered.reduce((acc, elem, index) => {
          if (index === 0) return acc;
          const date = elem.textContent;
          const title = elem.parentElement.firstChild.textContent;
          const link = elem.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('a').href;
          acc[title] = { date, link };
          return acc;
        }, {});
        return final;
      });

      this.games = parsedGames;
      logger.info(NAMESPACE, 'parsed games: ', this.games);
      browser.close();
    } catch (error) {
      logger.error(NAMESPACE, error.message, error);
    }
  },
};

export {
  epicGames,
};
