// 使用說明
const wrapper = require('../wrapper.js');
const emoji = require('node-emoji');

module.exports = new wrapper(/^help$/ig, help);

function help(event) {
    var str = `${emoji.get('sunny')}使用說明${emoji.get('sunny')}\n\n` +

        '[ 查價功能 ]\n' +
        '輸入 bot [symbol] 以查詢價格\n' +
        '支援BitMEX所有合約和Coinmarket上所有幣種\n\n' +
        '[ 提醒功能 ]\n' +
        '監視BitMEX目前倉位ROE。以標記價格為基準，預設盈餘 +-5% 提醒\n' +
        '1. 輸入bot watch api [apikey] [secret] 添加APIKEY\n' +
        '2. 添加APIKEY後，輸入bot watch start [趴數] 開始使用\n' +
        '3. 欲停止請輸入bot watch stop\n' +
        '\n' +
        '[ 爆倉通知 ]\n' +
        '在群組或房間內輸入bot group rekt可開啟爆倉通知，相當於rekt機器人\n' +
        '\n' +
        '[ 版本資訊 ]\n' +
        'bot version'
        ;

    event.reply(str);
}

//4. 尚未實作: 掛單成交\n'