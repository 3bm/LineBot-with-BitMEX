// 提醒在groupPool內的group爆倉通知
const wsc = require('./BitMEX_realtime');
const emoji = require('node-emoji');

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

        let str = '';
        wsc.liquidation.map((data, idx) => {

            // types:
            // { orderID: 'guid',
            //   symbol: 'symbol',
            //   side: 'symbol',
            //   price: 'float',
            //   leavesQty: 'long' },

            let Qty = data.leavesQty;
            if (Qty > 1) {
                Qty = Number(Qty).toFixed(0).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            }

            str = str + `${data.symbol} ${data.side == 'Buy' ? '空倉被爆: 買入' : '多倉被爆: 賣出'} ${Qty} @ ${data.price}`;
            if (idx != wsc.liquidation.length - 1) str = str + '\n';
        });

        // 嘲諷字串
        let arr = wsc.liquidation.map((data) => {
            return Math.log(data.leavesQty);
        });

        let max = Math.max(...arr);
        if (max >= 4 && max < 6) { // 1w~100w
            str = str + '\n｡:.ﾟヽ(*´∀`)ﾉﾟ.:｡';
        } else if (max >= 6 && max < 7) { // 100w~1000w
            str = str + '\n。･ﾟ･(つд`ﾟ)･ﾟ･';
        } else if (max >= 7 && max < 8) {  // 1000w~1e
            str = str + '\n (´;ω;`) ';
        }

        // send 
        sendNotice(str);
    };

    // always clear
    wsc.liquidation = [];
}, 10 * 1000); // 10秒檢查一次爆倉stack
