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

        // 限定XBT且>100,0000的爆倉資訊
        let arr = wsc.liquidation.filter((data) => {
            return data.symbol.includes('XBT') && data.price > 1000000;
        });

        let replyMsg = '',
            max = 0;
        arr.map((datamidx) => {

            let Qty = Number(data.leavesQty).toFixed(0).replace(/./g, function (c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
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
        if (max >= 6 && max < 7) { // 100w~1000w
            replyMsg = replyMsg + '\n｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡';
        } else if (max >= 7 && max < 8) { // 1000w~1e
            replyMsg = replyMsg + '\n。･ﾟ･(つд`ﾟ)･ﾟ･';
        } else if (max >= 8) {  // >1e 
            replyMsg = replyMsg + '\n (´;ω;`) ';
        }

        // send 
        sendNotice(replyMsg);
    };

    // always clear
    wsc.liquidation = [];
}, 60 * 1000); // 10秒檢查一次
