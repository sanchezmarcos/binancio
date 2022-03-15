const https = require("https");

function fetchP2PData(
  page = 1,
  fiat = "ARS",
  tradeType = "BUY",
  asset = "USDT",
  payTypes = []
) {
  return new Promise((resolve, reject) => {
    const baseObj = {
      page,
      rows: 20,
      publisherType: null,
      asset,
      tradeType,
      fiat,
      payTypes,
    };

    const stringData = JSON.stringify(baseObj);
    const options = {
      hostname: "p2p.binance.com",
      port: 443,
      path: "/bapi/c2c/v2/friendly/c2c/adv/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": stringData.length,
      },
    };

    const req = https.request(options, (res) => {
      let output = "";
      res.on("data", (d) => {
        output += d;
      });

      res.on("end", () => {
        try {
          const jsonOuput = JSON.parse(output);
          resolve(jsonOuput);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(stringData);
    req.end();
  });

  thanks();
}

module.exports = fetchP2PData;
