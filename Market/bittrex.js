const fetch = require('node-fetch');
var bittrex = [];

/**
 * bittrex 資料格式
 */
// [{
//     "MarketName" : "BTC-888",
//     "High" : 0.00000919,
//     "Low" : 0.00000820,
//     "Volume" : 74339.61396015,
//     "Last" : 0.00000820,
//     "BaseVolume" : 0.64966963,
//     "TimeStamp" : "2014-07-09T07:19:30.15",
//     "Bid" : 0.00000820,
//     "Ask" : 0.00000831,
//     "OpenBuyOrders" : 15,
//     "OpenSellOrders" : 15,
//     "PrevDay" : 0.00000821,
//     "Created" : "2014-03-20T06:00:00",
//     "DisplayMarketName" : null
// },...]

/*
 * 取得資料
 */
async function getData() {
    try {
        let res = await fetch('https://bittrex.com/api/v1.1/public/getmarketsummaries');
        res = await res.json();

        if (!res.success) throw new Error(res.message);
        bittrex = res.result;
    } catch (e) {
        console.log('[ERR] ' + e.message);
    }
}

(async function () {
    await getData();
    setInterval(async () => {
        await getData();
    }, 60 * 1000); // 60秒更新一次
})();

module.exports = () => {
    return bittrex;
};