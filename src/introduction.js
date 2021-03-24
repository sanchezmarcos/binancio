const package = require('../package.json');
const chalk = require('chalk');
const log = console.log;

const introduction = () => {
  log(``);
  log(` █▄▄ █ █▄░█ ▄▀█ █▄░█ █▀▀ █▀▀   █▀█ ▀█ █▀█   █▄▄ █▀█ ▀█▀`);
  log(` █▄█ █ █░▀█ █▀█ █░▀█ █▄▄ ██▄   █▀▀ █▄ █▀▀   █▄█ █▄█ ░█░`);
  log(chalk.hex('#f0b909')(` v${package.version} \n`))
  log(chalk.grey(" Bot that calculates median price of any crypto-asset in fiat"));
  log(chalk.grey(" currency on Binance's p2p exchange without leaving your console. \n"));
}

module.exports = introduction;