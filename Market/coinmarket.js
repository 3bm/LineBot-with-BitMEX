const fetch = require('node-fetch');
var coinmarket = [];

/**
 * coinmarketData 資料格式
 */
// {
//     "id": "ripple", 
//     "name": "Ripple", 
//     "symbol": "XRP", 
//     "rank": "3", 
//     "price_usd": "0.253845", 
//     "price_btc": "0.00004492", 
//     "24h_volume_usd": "382056000.0", 
//     "market_cap_usd": "9798531597.0", 
//     "available_supply": "38600451446.0", 
//     "total_supply": "99993285884.0", 
//     "percent_change_1h": "1.66", 
//     "percent_change_24h": "-1.77", 
//     "percent_change_7d": "6.06", 
//     "last_updated": "1507901641", 
//     "price_twd": "7.652462139", 
//     "24h_volume_twd": "11517536587.2", 
//     "market_cap_twd": "295388493239"
// }, 

/**
 * 取得資料
 */
async function getData() {
    try {
        let res = await fetch('https://api.coinmarketcap.com/v1/ticker/?convert=TWD');
        res = await res.json();

        if (res.error) throw new Error(res.error);
        coinmarket = res;
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
    return coinmarket;
};