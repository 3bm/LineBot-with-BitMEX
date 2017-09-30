// BitMEX成交提醒系統
// wss://www.bitmex.com/realtimemd
const utility = require('../LineBot/Utility.js');
const WebSocketClient = require('./WebSocketClient.js');
const emoji = require('node-emoji')
const wsc = new WebSocketClient();
module.exports = wsc;

wsc.open('wss://www.bitmex.com/realtimemd');

// 初始程序
wsc.init = function () {
    // 訂閱BitMEX特定頻道

    // shared variable 給該模組之外的程式使用
    // this.quote = [];

    // 向使用者廣播已上線
    utility.broadcast(`${emoji.get('white_check_mark')}成交提醒功能已上線`);
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
    utility.broadcast(`${emoji.get('warning')}成交提醒功能已離線，${this.autoReconnectInterval / (60 * 1000)}分後重新連線\n${emoji.get('warning')}重試次數:${this.reconnectCount}/${this.reconnectCountLimit}`);
}

// ONMESSAGE
wsc.onmessage = function (data, flags, number) {

}

/**
 * 發送 BitMEX 訊息相關Function 
 */

// 訂閱訊息
wsc.subscribe = function () {
    let arr = [];
    for (var i = 0; i < arguments.length; i++) {
        arr.push(arguments[i]);
    }
    this.sendCommand('subscribe', arr)
}

// 發送基本指令
wsc.sendCommand = function (op, args = []) {
    this.send(JSON.stringify({ op, args }));
}