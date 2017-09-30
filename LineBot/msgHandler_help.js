const emoji = require('node-emoji');

// 使用說明
module.exports = (event) => {
    let inputSymbol, tmp, format;

    // bot help
    format = /^bot\shelp$/ig;
    if ((tmp = format.exec(event.message.text)) !== null) {
        let str = "[ 使用說明 ]\n\n" +
            `${emoji.get('sunny')}查價功能\n輸入 bot [symbol] 以查詢價格。例如 bot zecz17 。支援所有BitMEX合約\n\n` +
            `${emoji.get('sunny')}系統提醒\n輸入 bot add\n 加入名單。系統上線、離線都會通知您。相反的，輸入 bot remove 則移出名單\n\n`;

        return event.reply(str)
    }

}