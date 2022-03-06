const { hasUndefinedProp } = require("../src/utils/commandValidations.js");
const fetchP2PData = require("./utils/fetchP2PData.js");
const QUESTIONS = require("./constants/questions.js");
const presentation = require("./presentation.js");
const median = require("./utils/median.js");
const thanks = require("./thanks.js");
const inquirer = require("inquirer");
const chalk = require("chalk");
const log = console.log;

const interview = async (input = null) => {
  let totalPrices = [];
  presentation();
  const isInterview = hasUndefinedProp(input);

  if (isInterview) {
    log(
      `${chalk.hex("#ffd654")(`⌥`)} ${chalk
        .hex("#f0b909")
        .bold(`I have a few questions`)}`
    );
  }

  const answers = isInterview ? await inquirer.prompt(QUESTIONS) : input;

  if (isInterview) {
    log(" ");
  }

  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`Collecting data for you`)}`
  );

  const ui = new inquirer.ui.BottomBar();
  ui.updateBottomBar(`${chalk.grey(`🔍  Fetching page 1`)} \n`);

  const firstPage = await fetchP2PData(
    1,
    answers.fiat,
    answers.operation,
    answers.ticker,
    answers.payTypes ? [answers.payTypes] : []
  );

  if (firstPage && firstPage.success) {
    const totalPages = Math.ceil(firstPage.total / 20);
    const pagesToRun = new Array(totalPages - 1).fill(null);
    const totalElements = await pagesToRun.reduce(async (prev, _, idx) => {
      const accData = await prev;
      const page = idx + 2;
      ui.updateBottomBar(
        `${chalk.grey(`🔍  Fetching page ${page}/${totalPages}`)} \n`
      );
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

  const minimun = answers.operation === "SELL" ? totalPrices.length - 1 : 0;
  const maximun = answers.operation === "SELL" ? 0 : totalPrices.length - 1;

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
      totalPrices[minimun].toLocaleString()
    )}`
  );

  log(
    `📊  ${chalk.grey("Median price")}  💵  ✨ ${chalk.bold(
      median(totalPrices).toLocaleString()
    )}✨`
  );

  log(
    `📈  ${chalk.grey("Maximun price")} 💵  ${chalk.bold(
      totalPrices[maximun].toLocaleString()
    )} \n`
  );

  thanks();
};

module.exports = interview;
