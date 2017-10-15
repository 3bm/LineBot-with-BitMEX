// 使用者查詢價位
const wsc = require('../../../BitMEX/BitMEX_realtime.js'); // 提供BitMEX查價
const coinmarket = require('../../../Coinmarket/'); // 提供CoinMarket查價

const emoji = require('node-emoji');

const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^([A-Za-z0-9]+)$/ig, query);

async function query(event, matchedStr) {
    let userinput = matchedStr.toUpperCase(),
        matched;

    /**
     * 查詢 BitMEX
     */

    // 使用者輸入是否屬於BitMEX提供的合約之一
    matched = wsc.quote.find((ele) => {
        return ele.symbol == userinput;
    })

    if (typeof matched != 'undefined') {
        // 是，查詢後回應使用者
        let replyMsg = `[ ${userinput} ]\n`;

        // 如果為NULL代表該幣已下線
        if (matched.bidPrice && matched.askPrice) {
            // 將ask,bidPrice取平均後維持原始格式小數點後的位數，對於ask,bitPrice差距較大的幣種(ex.zecz17)作用距大
            let p1 = (tmp = /^\d+\.(\d+)$/ig.exec(matched.bidPrice)) ? tmp[1] : ''; // 取小數點後的數字
            let p2 = (tmp = /^\d+\.(\d+)$/ig.exec(matched.askPrice)) ? tmp[1] : '';
            let p = Math.max(p1.length, p2.length); // 小數點後o位
            replyMsg = replyMsg + '[ Avg Price ] ' + Number((matched.bidPrice + matched.askPrice) / 2).toFixed(p) + '\n';

            replyMsg = replyMsg + '[ Ask Price ] ' + matched.askPrice + '\n';
            replyMsg = replyMsg + '[ Bid Price ] ' + matched.bidPrice;
        } else {
            // NULL
            replyMsg = replyMsg + emoji.get('heavy_multiplication_x'); // 叉叉X圖案
        }

        event.reply(replyMsg);
        return;
    }

    /**
    * 查詢CoinMarket
    */

    // 使用者輸入幣種是否可在coinmarket上查詢到
    matched = coinmarket().find((ele) => {
        let name = (ele.name).toUpperCase(),
            symbol = (ele.symbol).toUpperCase();
        return (name == userinput) || (symbol == userinput);
    });

    if (typeof matched != 'undefined') {

        // 是，查詢後回應使用者
        let replyMsg = `[ ${matched.name} ]\n` +
            `[ USD ] ${matched.price_usd}\n` +
            `[ TWD ] ${matched.price_twd}\n` +
            `[ BTC ] ${matched.price_btc}`;

        // KYC多一項對ETH匯率
        if (matched.symbol == 'knc') {
            try {
                let res = await fetch('https://api.coinmarketcap.com/v1/ticker/kyber-network/?convert=ETH');
                res = await res.json();
                replyMsg = replyMsg + `\n[ ETH ] ${res[0].price_eth}`
            } catch (e) {
                console.log(e)
            }
        }

        event.reply(replyMsg);
        return;
    }
}