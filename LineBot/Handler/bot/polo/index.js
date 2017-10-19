// polo查價功能
const wrapper = require('../../wrapper.js');
const getPoloniexData = require('../../../../Market/poloniex'); // 提供poloniex查價

module.exports = new wrapper(/^polo\s(.+)$/ig, polo);

function polo(event, matchedStr) {

    let poloniex = getPoloniexData();
    
    // Userinput
    matchedStr = matchedStr.toUpperCase();

    // BTC_X
    let btc = Object.keys(poloniex).find((data) => {
        return data == 'BTC_' + matchedStr;
    });

    // USDT_X
    let usdt = Object.keys(poloniex).find((data) => {
        return data == 'USDT_' + matchedStr;
    });

    // Reply
    if (usdt || btc) {
        let replyMsg = `[ ${matchedStr} ]\n`;
        if (usdt) replyMsg = replyMsg + `[ USDT ] ${poloniex[usdt].last}\n`;
        if (btc) replyMsg = replyMsg + `[ BTC ] ${poloniex[btc].last}\n`;
        replyMsg = replyMsg.slice(0, replyMsg.length - 1);
        event.reply(replyMsg);
    };
    return;
}

/**
 * poloniex 資料格式
 */
/*
    "BTC_ETH":{
        "id":148,
        "last":"0.06022003",
        "lowestAsk":"0.06029672",
        "highestBid":"0.06022009",
        "percentChange":"0.01151313",
        "baseVolume":"7164.77619297",
        "quoteVolume":"118514.63898717",
        "isFrozen":"0",
        "high24hr":"0.06243318",
        "low24hr":"0.05855220"
    }
*/