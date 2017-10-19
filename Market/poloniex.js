const fetch = require('node-fetch');
var poloniex = {};

/*
 * 取得資料
 */
async function getData() {
    try {
        let res = await fetch('https://poloniex.com/public?command=returnTicker');
        res = await res.json();
        poloniex = res;
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
    return poloniex;
};