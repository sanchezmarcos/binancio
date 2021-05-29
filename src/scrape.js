const inquirer = require('inquirer');
const ui = new inquirer.ui.BottomBar();
const chalk = require('chalk');
const log = console.log;

async function extractedEvaluateCall(page) {
  return page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll("#__APP > div.layout__Container-sc-1v4mjny-0.cRRZNA.scroll-container > main > div.css-16g55fu > div > div.css-vurnku > div");
    for (var element of elements) {
      let price = element.childNodes[0].childNodes[1].innerText.replace('\nARS', '').replace(/,/g, '').split('.')[0];
      data.push(parseFloat(price));
    }
    return data;
  });
}

//div.css-kwfbf > div button:last-child
let scrape = async (page) => {
  let count = 0;
  let results = [];
  let firstScrap = true;
  let paginationNext = await page.$$('div.css-kwfbf > div button:last-child[disabled]');
  while (paginationNext.length === 0 || firstScrap) {
    count++;
    firstScrap = false;
    await page.waitForTimeout(1000);
    ui.updateBottomBar(`📄 ${chalk.bold(count)} ${chalk.grey(`${count > 1 ? 'pages indexed    ' : 'page indexed     '}`)} `);
    results = results.concat(await extractedEvaluateCall(page));
    paginationNext = await page.$$('div.css-kwfbf > div button:last-child[disabled]');
    (paginationNext.length > 0) ? log('✅ \n') : false;
    try {
      await page.click('div.css-kwfbf > div button:last-child');
    } catch (error) {}
  }
  return results;
};

module.exports = scrape;