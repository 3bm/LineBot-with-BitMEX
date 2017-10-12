// BitMEX成交提醒系統
// wss://www.bitmex.com/realtimemd
const utility = require('../LineBot/Utility');
const WebSocketClient = require('./WebSocketClient.js');
const emoji = require('node-emoji')
const wsc = new WebSocketClient(30 * 1000, 30);
module.exports = wsc;

// wsc.open('wss://www.bitmex.com/realtimemd');

// 初始程序
wsc.init = async function () {
    // 向使用者廣播已上線
    utility.broadcast(`${emoji.get('white_check_mark')}提醒功能已上線`);

    await utility.delay(1000);

    // 回復使用者連線狀態
    global.userPool.map(async (user) => {
        // 上次的狀態是連線中或是已連線
        if (user.status == 1 || user.status == 2) {
            // 重設連線狀態並連線
            user.status = 0;
            await user.start();
        }
    });

}

// ONOPEN
wsc.onopen = function (e) {
    // 初始程序
    this.init();
}

// ONCLOSE
wsc.onclose = function (e) {
}

// ONRECONNECT
wsc.onreconnect = function () {
    // 向使用者廣播已斷線，重新連線中
    utility.broadcast(`${emoji.get('warning')}提醒功能已離線，${this.autoReconnectInterval / (60 * 1000)}分後重新連線\n${emoji.get('warning')}重試次數:${this.reconnectCount}/${this.reconnectCountLimit}`);
}

// ONMESSAGE
wsc.onmessage = function (data, flags, number) {
    console.log(data, flags, number);
}