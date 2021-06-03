const package = require('../package.json');
const chalk = require('chalk');
const log = console.log;

const introduction = () => {
  log(``);
  log(` █▄▄ █ █▄░█ ▄▀█ █▄░█ █▀▀ █ █▀█`);
  log(` █▄█ █ █░▀█ █▀█ █░▀█ █▄▄ █ █▄█ ${chalk.hex('#f0b909').bold(`v${package.version}`)} \n`);
  log(chalk.grey(" Hi! I am Binancio 👋  I can help you calculate the median price"));
  log(chalk.grey(" of any cryptoasset in fiat money, right on your console.\n"));
  log(`${chalk.hex("#ffd654")(`⌥`)} ${chalk.hex("#f0b909").bold(`I have a few questions`)}`);
}

module.exports = introduction;