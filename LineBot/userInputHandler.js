var moment = require('moment');
var startTime = moment();

const supportSymbol = ["XBTUSD", "XBTU17"];

function l_eventHandler(event, globalObj) {
    this.globalObj = globalObj;

    this.event = event;
    // event object :: Common fields
    this.source = event.source;
    this.getType = () => { return this.source.type }
    this.getRoomID = () => { return this.source.roomId }
    this.getGroupID = () => { return this.source.groupId }
    this.getUserID = () => { return this.source.userId }
    // event object :: Message event
    this.message = this.source.message;
    this.getMessageType = () => { return this.message.type }
}

// For developer
l_eventHandler.prototype.test = function () {
    let event = this.event;

    console.log(event);
}

// 訂閱or取消訂閱rekt
l_eventHandler.prototype.rekt = function (broadcast_queue) {
    // 未完成

    // 使用者輸入: bot rekt
    // let tmp;
    // const inputFormat = /^bot\srekt$/ig;
    // if ((tmp = inputFormat.exec(this.event.message.text)) !== null) {
    //     // 把使用者加入broadcast list 或是 移除
    //     let id = this.getRoomID() || this.getGroupID() || this.getUserID();
    //     let idx;
    //     if ((idx = broadcast_queue.rekt.indexOf(id)) != -1) {
    //         broadcast_queue.rekt.splice(idx, 1);
    //         this.event.reply(`Unsubscribe for REKT`);
    //     }
    //     else {
    //         broadcast_queue.rekt.push(id);
    //         this.event.reply(`Subscribe for REKT\n 再輸入一次則取消訂閱`);
    //     }
    // }
    return this;
}

// 輸出BitMEX最新資訊
l_eventHandler.prototype.instrument = function () {

    // 使用者輸入: bot [Symbol]
    let inputSymbol, tmp;
    const priceFormat = /^bot\s(\w+)$/ig;
    if ((tmp = priceFormat.exec(this.event.message.text)) !== null) {
        if (tmp[1]) inputSymbol = tmp[1].toUpperCase();
    }

    // 回應對應項目
    if (supportSymbol.indexOf(inputSymbol) != -1) {
        let i = this.globalObj['instrument'][inputSymbol];
        let j = this.globalObj['quote'][inputSymbol];
        let replyStr = "";
        // instrument
        if (i && i.timestamp) { // 確保有資料以免輸出null
            replyStr = replyStr +
                `[ ${i.symbol} ]\n` +
                `[ 標記價格 ] ${i.markPrice} USD\n` +
                `[ 價格指數 ] ${i.indicativeSettlePrice} USD\n` +
                // XBTUST專屬欄位
                (i.fundingRate ?
                    `[ 資金費率 ] ${parseFloat(100 * i.fundingRate).toFixed(4)} %\n` +
                    `[ 預測費率 ] ${parseFloat(100 * i.indicativeFundingRate).toFixed(4)} %\n`
                    : "");
            //`[ 最後更新 ] ${moment().diff(moment(i.timestamp), 'seconds')}秒前`;
        }

        // quote
        if (j && j.timestamp) {
            replyStr = replyStr +
                `[ Bid Price ] ${j.bidPrice} USD\n` +
                `[ Ask Price ] ${j.askPrice} USD`
        }

        this.event.reply(replyStr);
    }
    return this;
}

// Help
l_eventHandler.prototype.help = function () {
    const inputFormat = /^bot\shelp$/ig;
    let tmp;
    let BitMEXData =this.globalObj;
    if ((tmp = inputFormat.exec(this.event.message.text)) !== null) {
        this.event.reply('[指令說明]\n' +
            '[bot XBTUSD/XBTU17] 查詢價位\n\n' +
            `[啟動時間] ${moment().diff(startTime, 'seconds')} 秒\n`)
    }
    return this;
}

// Emoji
// const emoji = require('node-emoji')
// l_eventHandler.prototype.emoji = function () {
//     const inputFormat = /^bot\s((:)\w+(:))$/ig;
//     let tmp;
//     if ((tmp = inputFormat.exec(this.event.message.text)) !== null) {
//         this.event.reply(
//             emoji.emojify(tmp[1], name => name)
//         );
//     }
//     return this;
// }

module.exports = l_eventHandler;


