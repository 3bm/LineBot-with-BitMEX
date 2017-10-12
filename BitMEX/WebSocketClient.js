// code參考:https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect
// 新增功能
// 1.在open和close內加入了Heartbeat
// 2.紀錄open/close/reconnect/error事件，儲存成ws.log
// 3.限制最大重連次數(reconnectCountLimit)，超過則強制終止process

const WebSocket = require('ws');
const fs = require('fs');
const moment = require('moment');

function WebSocketClient(autoReconnectInterval = 60 * 1000, reconnectCountLimit = 10) {
    this.number = 0;	// Message number
    this.autoReconnectInterval = autoReconnectInterval;	// ms
    this.reconnectCount = 0;
    this.reconnectCountLimit = reconnectCountLimit;
}

WebSocketClient.prototype.open = function (url) {
    this.url = url;
    this.instance = new WebSocket(this.url);
    this.instance.on('open', () => {
        this.log('WebSocketClient: connection established (' + this.url + ')');
        /* 重設reconnectCount */
        this.reconnectCount = 0;
        /* 初始化heartbeat */
        this.isAlive = true;
        // pong
        this.instance.on('pong', () => {
            this.isAlive = true;
        });
        this.heartbeat = setInterval(() => {
            if (this.isAlive === false) {
                clearInterval(this.heartbeat);
                return this.instance.close(4000);
            }
            // ping
            this.isAlive = false;
            this.instance.ping('', true, true);
        }, 10 * 1000);
        /* 初始化heartbeat結束 */
        this.onopen();
    });
    this.instance.on('message', (data, flags) => {
        this.number++;
        this.onmessage(data, flags, this.number);
    });
    this.instance.on('close', (e) => {
        switch (e) {
            // 參考: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
            case 1000:	// CLOSE_NORMAL
                this.log("WebSocket: closed");
                break;
            case 4000: // 因為Heartbeat失敗所引發的關閉
                this.log("WebSocketClient: Heartbeat failed");
                this.reconnect(e);
                break;
            default:	// Abnormal closure
                this.log("WebSocketClient: Abnormal closure");
                this.reconnect(e);
                break;
        }
        this.onclose(e);
    });
    this.instance.on('error', (e) => {
        this.log("WebSocketClient: error", e);
        switch (e.code) {
            case 'ECONNREFUSED':
                this.reconnect(e);
                break;
            default:
                this.onerror(e);
                break;
        }
    });
}
WebSocketClient.prototype.send = function (data, option) {
    try {
        this.instance.send(data, option);
    } catch (e) {
        this.instance.emit('error', e);
    }
}
WebSocketClient.prototype.reconnect = function (e) {
    // 重連次數+1
    this.reconnectCount = this.reconnectCount + 1;

    // 限制reconnect次數
    if (this.reconnectCount > this.reconnectCountLimit) {
        this.instance.terminate(); // 不觸發close event
        return process.emit('SIGINT');
    }

    this.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`);
    this.onreconnect();

    var that = this;
    setTimeout(function () {
        that.log("WebSocketClient: reconnecting...");
        that.open(that.url);
    }, this.autoReconnectInterval);
}

WebSocketClient.prototype.onopen = function (e) { /* console.log("WebSocketClient: open", arguments); */ }
WebSocketClient.prototype.onmessage = function (data, flags, number) { /* console.log("WebSocketClient: message", arguments); */ }
WebSocketClient.prototype.onerror = function (e) { /* console.log("WebSocketClient: error", arguments); */ }
WebSocketClient.prototype.onclose = function (e) { /* this.log("WebSocketClient: closed", arguments); */ }
WebSocketClient.prototype.onreconnect = function (e) { };

// 紀錄open/close/reconnect/error等事件由WebSocketClient負責
const logFilename = './ws.log';
WebSocketClient.prototype.log = function (...text) {
    // 只顯示部分訊息
    console.log(text[0]);
    // 紀錄完整訊息
    fs.appendFile(logFilename, `${moment().format('YYYY-MM-DD hh:mm:ss')} ${JSON.stringify(text)}\n`, (err) => {
        if (err) throw err;
    });
}

module.exports = WebSocketClient;