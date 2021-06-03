const chalk = require("chalk");
const log = console.log;

const thanks = () => {
  log(
    `${chalk.hex("#ffd654")(`⌥`)} ${chalk
      .hex("#f0b909")
      .bold(`I hope I have been useful! `)}`
  );

  log(`In case you want to support me, here is my ethereum address:`);
  log(
    `${chalk.hex("#ffd654").bold("Ξ")} ${chalk.grey.bold(
      "0xaA48b4238C0fF0112977395B247C0341acB8809F"
    )} \n`
  );
  log(`${chalk.bold("Thank you!")}`);
  log(`Sanchez Marcos ${chalk.hex("#f0b909")("©")} Q2/2021`);
  process.exit(0);
};

module.exports = thanks;
