const fetch = require('node-fetch');
var bitfinex = {};
var symbols;

/**
 * delay
 */
function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms)
    })
}

/**
 * updateData - 更新資料
 */
async function updateData() {
    for (var i = 0; i < symbols.length; i = i + 1) {
        try {
            let symbol = symbols[i];
            let res = await fetch(`https://api.bitfinex.com/v1/pubticker/${symbol}`);
            res = await res.json();

            if (res.error) throw new Error(res.error);
            bitfinex[symbol] = res;

            await delay(1000);
        } catch (e) {
            console.log(e);
        }
    }
}

/**
 * initSymbols - 抓取symbols
 * ["btcusd","ltcusd","ltcbtc","ethusd"...]
 */
async function initSymbols() {
    try {
        var res = await fetch('https://api.bitfinex.com/v1/symbols');
        symbols = await res.json();
    } catch (e) {
        console.log(e);
    }
};

/**
 * bitfinex 資料格式
 * Data type: {"mid":"0.01009","bid":"0.010088","ask":"0.010092","last_price":"0.010089","low":"0.00875","high":"0.010456","volume":"288148.94872306","timestamp":"1508870721.1461127"}
 */
(async function () {
    await initSymbols();
    await updateData();
    setInterval(async () => {
        await updateData();
    }, 120 * 1000); // bitfinex limit: 60 request/min 因此設120秒更新一次
})();

module.exports = () => {
    return bitfinex;
};