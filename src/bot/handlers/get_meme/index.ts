import { TelegrafContext } from 'telegraf/typings/context';
import logger from '../../../helpers/loggers';

const puppeteer = require('puppeteer');

const NAMESPACE = 'get_meme/index.ts';

const memeBank = {
  url: 'https://admem.ru/rndm',
  memes: [],
  async parseMemes() {
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
      await page.goto(this.url, { waitUntil: 'networkidle2' });

      const parsedMems = await page.evaluate(() => {
        const allTexts = document.querySelectorAll('.post-img');
        if (!allTexts.length) return;
        return [...allTexts].map((elem) => `https:${elem.firstElementChild!.firstElementChild!.getAttribute('src')}`);
      });

      logger.info(NAMESPACE, 'parsed memes', parsedMems);
      this.memes = parsedMems;

      browser.close();
    } catch (error) {
      logger.error(NAMESPACE, 'err in parseMemes', error);
    }
  },
  async getMeme(): Promise<string> {
    if (!this.memes.length) { await this.parseMemes(); }
    return this.memes.pop()!;
  },
};

const handleMeme = async (ctx: TelegrafContext) => {
  try {
    const imageUrl = await memeBank.getMeme();
    ctx.replyWithPhoto(imageUrl);
  } catch (error) {
    logger.error(NAMESPACE, 'handleMeme err', error);
  }
};

export default handleMeme;
