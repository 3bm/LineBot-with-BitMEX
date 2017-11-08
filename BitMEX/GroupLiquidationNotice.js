// 提醒在groupPool內的group爆倉通知，限定XBTUSD,XBTZ17
const wsc = require('./BitMEX_realtime');

function sendNotice(text) {
    global.groupPool.map((group) => {
        let groupLineId = group.groupLineId,
            rekt = group.rekt;
        if (rekt) {
            bot.push(groupLineId, text);
        }
    })
}

setInterval(() => {
    if (wsc.liquidation.length > 0) {

        /*
        types:
        { orderID: 'guid',
          symbol: 'symbol',
          side: 'symbol',
          price: 'float',
          leavesQty: 'long' },
        */

        // 限定XBT且>3*10^6的爆倉資訊
        let arr = wsc.liquidation.filter((data) => {
            return data.symbol.includes('XBT') && (Math.log(data.leavesQty) / Math.log(10) > 5.47712125472);
        });

        let replyMsg = '',
            max = 0;

        if (arr.length > 0) {

            arr.map((data, idx) => {
                let Qty = Number(data.leavesQty).toFixed(0).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 4 === 0) ? ',' + c : c;
                });

                if (data.side == 'Buy') {
                    replyMsg = replyMsg + `${data.symbol} 空倉被爆: 買入 ${Qty} @ ${data.price}`;
                } else if (data.side == 'Sell') {
                    replyMsg = replyMsg + `${data.symbol} 多倉被爆: 賣出 ${Qty} @ ${data.price}`;
                };

                if (arr.length - 1 != idx) replyMsg = replyMsg + '\n';

                // maximum
                max = max < data.leavesQty ? data.leavesQty : max;
            });

            // 嘲諷字串
            max = Math.log(max) / Math.log(10);
            if (max >= 5 && max < 7) { // 10w~1000w
                replyMsg = replyMsg + '\n｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡';
            } else if (max >= 7 && max < 8) { // 1000w~1e
                replyMsg = replyMsg + '\n。･ﾟ･(つд`ﾟ)･ﾟ･';
            } else if (max >= 8) {  // >1e 
                replyMsg = replyMsg + '\n (´;ω;`) ';
            }

            // send 
            sendNotice(replyMsg);
        }
    };

    // always clear
    wsc.liquidation = [];
}, 10 * 1000); // 10秒檢查一次
