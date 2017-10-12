// 使用說明
const wrapper = require('../wrapper.js');
const emoji = require('node-emoji');

module.exports = new wrapper(/^help$/ig, help);

function help(event) {
    var str = `${emoji.get('sunny')}使用說明${emoji.get('sunny')}\n\n` +

        '[ 查價功能 ]\n' +
        '輸入 bot [symbol] 以查詢價格。例如bot zecz17,bot xbtusd,bot ethz17...。支援所有BitMEX合約\n\n' +
        '[ 提醒功能 ]\n' +
        '以標記價格為基準，盈餘+-10% 會透過LINE提醒\n' +
        '1. 輸入bot watch api "apikey" "secret" 添加APIKEY\n' +
        '2. 添加APIKEY後，輸入bot watch start 開始使用\n' +
        '3. 欲停止請輸入bot watch stop\n' +
        '4. 尚未實作: 掛單成交,爆倉提醒\n' +
        '\n' +
        '[ 版本資訊 ]\n' +
        '輸入 bot version \n\n'
        ;

    event.reply(str);
}