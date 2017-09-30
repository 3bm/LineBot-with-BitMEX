const wsc = require('../BitMEX/BitMEX_realtime.js'); // 提供查價
const emoji = require('node-emoji');

// 給使用者查價
module.exports = (event) => {
    let inputSymbol, tmp, format;

    // bot [symbol]
    // 使用者查詢oo幣價位
    format = /^bot\s([A-Za-z0-9]+)$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {
        let userinput = tmp[1].toUpperCase();
        // 使用者輸入使否屬於BitMEX提供的幣種之一
        let matched = wsc.quote.find((ele) => {
            return ele.symbol == userinput;
        })
        // 是，查詢後回應使用者
        if (typeof matched != 'undefined') {
            let replyMsg = `[ ${userinput} ]\n`;

            // 如果為NULL代表該幣已下線
            if (matched.bidPrice && matched.askPrice) {
                // 將ask,bidPrice取平均後維持原始格式小數點後的位數，對於ask,bitPrice差距較大的幣種(ex.zecz17)作用距大
                let p1 = (tmp = /^\d+\.(\d+)$/ig.exec(matched.bidPrice)) ? tmp[1] : ''; // 取小數點後的數字
                let p2 = (tmp = /^\d+\.(\d+)$/ig.exec(matched.askPrice)) ? tmp[1] : '';
                let p = Math.max(p1.length, p2.length); // 小數點後o位
                replyMsg = replyMsg + Number((matched.bidPrice + matched.askPrice) / 2).toFixed(p);
            } else {
                // NULL
                replyMsg = replyMsg + emoji.get('heavy_multiplication_x'); // 叉叉X圖案
            }

            return event.reply(replyMsg);
        }
    }
}