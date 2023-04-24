import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const parse = async (
  url: string = 'https://dev.amidstyle.com',
): Promise<string> => {
  const puppeteerWithPlugin = puppeteer.use(StealthPlugin());

  const browser = await puppeteerWithPlugin.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();

    await page.goto(url);

    const selector = '#data';

    await page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);

        if (!element) return false;

        return element.innerHTML.trim().length;
      },
      {},
      selector,
    );

    // Get the element
    const data = await page.$(selector);

    if (!data) throw new Error('Not found element');

    const textContent = await page.evaluate((el) => el.textContent, data);

    if (!textContent) throw new Error('Not found textContent');

    const obj = JSON.parse(textContent);

    const sign = obj?.sign;

    if (!sign) throw new Error('Not found sign');

    const newObj = {
      sign,
    };

    return JSON.stringify(newObj);
  } catch (error) {
    throw new Error(error);
  } finally {
    await browser.close();
  }
};

parse().then((res) => {
  console.log(res);
});
