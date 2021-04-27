const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();
const chalk = require('chalk');
const log = console.log;

async function extractedEvaluateCall(page) {
  return page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll('main > div.css-16g55fu > div.css-cjwhpx > div.css-vurnku > div.css-79tjl5 > div.css-3um3kv > div.css-11db165 > div.css-4ptx7h > div.css-1kj0ifu');
    for (var element of elements) {
      let price = element.childNodes[1].innerText;
      data.push(parseFloat(price));
    }
    return data;
  });
}

let scrape = async (page) => {
  let count = 0;
  let results = [];
  let firstScrap = true;
  let paginationNext = await page.$$('main > div.css-16g55fu > div > div.css-kwfbf > div > button[disabled]');

  while (paginationNext.length === 0 || firstScrap) {
    count++;
    firstScrap = false;
    await page.waitForTimeout(500);
    ui.updateBottomBar(`📄 ${chalk.bold(count)} ${chalk.grey(`${count > 1 ? 'pages indexed    ' : 'page indexed     '}`)} `);
    results = results.concat(await extractedEvaluateCall(page));
    paginationNext = await page.$$('main > div.css-16g55fu > div > div.css-kwfbf > div > button[disabled]');
    (paginationNext.length > 0) ? log('✅ \n') : false;
    await page.click('main > div.css-16g55fu > div > div.css-kwfbf > div > button');
  }
  return results;
};

module.exports = scrape;
