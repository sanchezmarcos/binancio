#!/usr/bin/env node
const fetchP2PData = require("./src/fetchP2PData.js");
const introduction = require("./src/introduction.js");
const ANSWERS = require("./src/answers.js");
const median = require("./src/median.js");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ROWS_PER_PAGE = 200;
const log = console.log;
let totalPrices = [];

(async () => {
  // Introduction message
  introduction();

  // Step 1
  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`I have a few questions 🤔 \n`)}`
  );

  const answers = await inquirer.prompt(ANSWERS);

  // Step 2
  log(
    `\n${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Collecting the data for you 🧐 \n`)}`
  );

  const ui = new inquirer.ui.BottomBar();
  (async () => {
    totalPrices = [];
    const firstPage = await fetchP2PData(
      1,
      answers.fiat,
      answers.type,
      answers.ticker
    );
    if (firstPage && firstPage.success) {
      const totalPages = Math.ceil(firstPage.total / ROWS_PER_PAGE);
      const pagesToRun = new Array(totalPages - 1).fill(null);
      const totalElements = await pagesToRun.reduce(async (prev, _, idx) => {
        const accData = await prev;
        const page = idx + 2;
        const pageResult = await fetchP2PData(
          page,
          answers.fiat,
          answers.type,
          answers.ticker
        );
        if (pageResult && pageResult.success) {
          return [...accData, ...pageResult.data];
        }
        return accData;
      }, Promise.resolve(firstPage.data));
      totalElements.map((obj) => {
        totalPrices.push(parseInt(obj.adv.price));
      });
    }

    log(
      `${chalk.hex("#ffd654")(`⌥`)} ${chalk
        .hex("#f0b909")
        .bold(`Here are the results! 🤓 \n`)}`
    );
    log(
      `📉  ${chalk.grey("Minimun price")} 💵  ${chalk.bold(
        totalPrices[0].toLocaleString()
      )}`
    );
    log(
      `🕛  ${chalk.grey("Median price")}  💵  ✨ ${chalk.bold(
        median(totalPrices).toLocaleString()
      )}✨`
    );
    log(
      `📈  ${chalk.grey("Maximun price")} 💵  ${chalk.bold(
        totalPrices[totalPrices.length - 1].toLocaleString()
      )}`
    );
    log(
      `🛍  ${chalk.grey("People offering")} ${chalk.bold(totalPrices.length)} \n`
    );
    // log(`Sanchez Marcos ${chalk.hex('#f0b909')('©')} 2021`);
    process.exit(0);
  })();
})();
