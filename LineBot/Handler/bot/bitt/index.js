// bittrex查價功能
const wrapper = require('../../wrapper.js');
const getBittrexData = require('../../../../Market/bittrex'); // 提供bittrex查價

module.exports = new wrapper(/^bitt\s(.+)$/ig, bitt);

function bitt(event, matchedStr) {

    let bittrex = getBittrexData();

    // Userinput
    matchedStr = matchedStr.toUpperCase();

    // BTC_X
    let btc = bittrex.find((data) => {
        return data.MarketName == 'BTC-' + matchedStr;
    });

    // USDT_X
    let usdt = bittrex.find((data) => {
        return data.MarketName == 'USDT-' + matchedStr;
    });

    // Reply
    if (usdt || btc) {
        let replyMsg = `[ ${matchedStr} ]\n`;
        if (usdt) replyMsg = replyMsg + `[ USDT ] ${usdt.Last}\n`;
        if (btc) replyMsg = replyMsg + `[ BTC ] ${btc.Last}\n`;
        replyMsg = replyMsg.slice(0, replyMsg.length - 1);
        event.reply(replyMsg);
    };
    return;
}

/**
 * bittrex 資料格式
 */
/*
[{
    "MarketName" : "BTC-888",
    "High" : 0.00000919,
    "Low" : 0.00000820,
    "Volume" : 74339.61396015,
    "Last" : 0.00000820,
    "BaseVolume" : 0.64966963,
    "TimeStamp" : "2014-07-09T07:19:30.15",
    "Bid" : 0.00000820,
    "Ask" : 0.00000831,
    "OpenBuyOrders" : 15,
    "OpenSellOrders" : 15,
    "PrevDay" : 0.00000821,
    "Created" : "2014-03-20T06:00:00",
    "DisplayMarketName" : null
},...]
*/
