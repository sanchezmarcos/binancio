#!/usr/bin/env node
const tickerIndexes = { USDT: 1, BTC: 2, BNB: 3, BUSD: 4, ETH: 5, DAI: 6 };
const ANSWERS = require('./src/answers.js');
const median = require('./src/median.js');
const scrape = require('./src/scrape.js');
const introduction = require('./src/introduction.js');
const puppeteer = require('puppeteer');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = console.log;

(async () => {
  // Introduction message
  introduction();

  // Step 1
  log(`1️⃣  ${chalk.bold.underline(`Answer some questions \n`)}`);
  const answers = await inquirer.prompt(ANSWERS);

  // Step 2
  log(`\n2️⃣  ${chalk.bold.underline(`Bot connecting to Binance \n`)}`);
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [`--window-size=1400,800`] });
  const ui = new inquirer.ui.BottomBar();
  const page = await browser.newPage();
  await page.goto('https://p2p.binance.com/en');
  await page.waitForSelector(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[answers.ticker]})`);

  // Select ticker
  ui.updateBottomBar(`📌 ${chalk.grey('Selecting crypto')} ${chalk.bold(answers.ticker)} `);
  await page.click(`main > div.css-1u2nsrt > div > div > div.css-8f6za > div > div:nth-child(${tickerIndexes[answers.ticker]})`);
  await page.waitForTimeout(1000);
  log('✅');

  // Select fiat 
  ui.updateBottomBar(`📌 ${chalk.grey('Selecting fiat  ')} ${chalk.bold(answers.fiat)} `);
  await page.waitForSelector('#C2Cfiatfilter_searhbox_fiat');
  await page.click('#C2Cfiatfilter_searhbox_fiat');
  await page.waitForTimeout(1000);
  await page.waitForSelector(`#${answers.fiat}`);
  await page.click(`#${answers.fiat}`);
  await page.waitForTimeout(1000);
  log('✅');

  // Select buy / sell
  ui.updateBottomBar(`📌 ${chalk.grey('Selecting type  ')} ${chalk.bold(answers.operation)} `);
  (answers.operation === 'Sell') ? await page.click('main > div.css-1u2nsrt > div > div > div.css-1yl7p9 > div > div.css-yxrkwa') : false;
  await page.waitForTimeout(2000);
  log('✅');

  // Step 3 
  scrape(page).then((value) => {
    log(`3️⃣  ${chalk.bold.underline(`Processed results \n`)}`);
    ui.updateBottomBar('');
    browser.close();
    log(`📉 ${chalk.grey('Minimun price')} 💵 ${chalk.bold(value[0].toLocaleString().replace(/,/g, '.'))}`);
    log(`🕛 ${chalk.grey('Median price')}  💵 ${chalk.bold(median(value).toLocaleString().replace(/,/g, '.'))}`);
    log(`📈 ${chalk.grey('Maximun price')} 💵 ${chalk.bold(value[value.length - 1].toLocaleString().replace(/,/g, '.'))}`);
    log(`🛍  ${chalk.grey('People offering')}  ${chalk.bold(value.length.toLocaleString().replace(/,/g, '.'))} \n`);
    log(`${chalk.grey('Sanchez Marcos')} © 2021`);
    process.exit(0);
  });
})();