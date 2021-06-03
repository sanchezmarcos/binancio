const fetchP2PData = require("./utils/fetchP2PData.js");
const QUESTIONS = require("./constants/questions.js");
const introduction = require("./introduction.js");
const median = require("./utils/median.js");
const thanks = require("./thanks.js");
const inquirer = require("inquirer");
const chalk = require("chalk");
const log = console.log;

const interview = async () => {
  introduction();
  const answers = await inquirer.prompt(QUESTIONS);
  let totalPrices = [];

  log(
    `\n${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Collecting data for you`)}`
  );

  const firstPage = await fetchP2PData(
    1,
    answers.fiat,
    answers.operation,
    answers.ticker
  );

  if (firstPage && firstPage.success) {
    const totalPages = Math.ceil(firstPage.total / 20);
    const pagesToRun = new Array(totalPages - 1).fill(null);
    const totalElements = await pagesToRun.reduce(async (prev, _, idx) => {
      const accData = await prev;
      const page = idx + 2;
      const pageResult = await fetchP2PData(
        page,
        answers.fiat,
        answers.operation,
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
    `🔗  ${chalk.grey("Transaction type")} ${chalk.bold(
      answers.ticker
    )} @ ${chalk.bold(answers.fiat)}`
  );

  log(
    `💰  ${chalk.bold(totalPrices.length)} ${chalk.grey("People offering")} \n`
  );

  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Here I have the results`)}`
  );

  log(
    `📉  ${chalk.grey("Minimun price")} 💵  ${chalk.bold(
      totalPrices[0].toLocaleString()
    )}`
  );

  log(
    `📊  ${chalk.grey("Median price")}  💵  ✨ ${chalk.bold(
      median(totalPrices).toLocaleString()
    )}✨`
  );

  log(
    `📈  ${chalk.grey("Maximun price")} 💵  ${chalk.bold(
      totalPrices[totalPrices.length - 1].toLocaleString()
    )} \n`
  );

  thanks();
};

module.exports = interview;
