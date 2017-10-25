// bitfinex查價功能
const wrapper = require('../../wrapper.js');
const getBitfinexData = require('../../../../Market/bitfinex'); // 提供bittrex查價

module.exports = new wrapper(/^bitf\s(.+)$/ig, bitf);

function bitf(event, matchedStr) {

    let bitfinex = getBitfinexData();

    // Userinput
    matchedStr = matchedStr.toUpperCase();

    /**
     * Bitfinex資料格式
     * {"mid":"0.01009","bid":"0.010088","ask":"0.010092","last_price":"0.010089",...}
     */
    let matchedArr = Object.keys(bitfinex).filter((symbol) => {
        return symbol.slice(0, 3).toUpperCase() == matchedStr;
    });

    if (matchedArr.length > 0) {
        let replyMsg = `[ ${matchedStr} ]\n`;
        matchedArr.map((symbol) => {
            replyMsg = replyMsg + `[ ${symbol.slice(3, 6).toUpperCase()} ] ${bitfinex[symbol].mid}\n`
        });
        replyMsg = replyMsg.slice(0, replyMsg.length - 1);

        event.reply(replyMsg);
    }
}
