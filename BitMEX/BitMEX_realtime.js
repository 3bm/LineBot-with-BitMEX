// BitMEX查價系統
// wss://www.bitmex.com/realtime
const utility = require('../LineBot/Utility');
const WebSocketClient = require('./WebSocketClient.js');
const emoji = require('node-emoji')
const wsc = new WebSocketClient(30 * 1000, 30);
module.exports = wsc;

// wsc.open('wss://www.bitmex.com/realtime');

// shared variable 給該模組之外的程式使用
wsc.quote = [];
wsc.liquidation = [];

// 初始程序
wsc.init = function () {
    // 訂閱BitMEX特定頻道
    this.subscribe('quote', 'liquidation');
    // this.subscribe('instrument:XBTUSD', 'instrument:XBTU17');

    // reset
    this.quote = [];
    this.liquidation = [];

    // 向使用者廣播已上線
    utility.broadcast(`${emoji.get('white_check_mark')}查價功能已上線`);
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
    utility.broadcast(`${emoji.get('warning')}查價功能已離線，${this.autoReconnectInterval / (60 * 1000)}分後重新連線\n${emoji.get('warning')}重試次數:${this.reconnectCount}/${this.reconnectCountLimit}`);
}

// ONMESSAGE
wsc.onmessage = function (data, flags, number) {

    let rev = JSON.parse(data);

    if (rev.table == 'quote') {
        // quote資料
        // 第一次接收到資料
        if (rev.action == 'partial') {
            this.quote = rev.data.slice(0, rev.data.length); // 複製收到的資料
        }

        // 第n>1次接收到資料
        if (rev.action == 'insert') {
            rev.data.map((ele) => {
                let idx = this.quote.findIndex((quote_ele) => { return quote_ele.symbol == ele.symbol; });
                this.quote[idx] = Object.assign({}, ele);  // 複製收到的資料
                // console.log(this.quote[this.quote.length-1])
            })
        }
    } else if (rev.table == 'liquidation') {
        // liquidation
        // types:
        // { orderID: 'guid',
        //   symbol: 'symbol',
        //   side: 'symbol',
        //   price: 'float',
        //   leavesQty: 'long' },

        if (rev.action == 'partial') {

        } else if (rev.action == 'delete') {

        } else if (rev.action == 'insert') {
            console.log(ele);
            rev.data.map((ele) => {
                this.liquidation.push(ele);
            })
        }

    }

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

/**
 * 向BitMEX訂閱quote的回應
 */
// 基本格式
/**
 { table: 'quote',
  action: 'insert',
  data:
   [ { timestamp: '2017-09-29T18:27:16.445Z',
       symbol: 'XBTUSD',
       bidSize: 10131,
       bidPrice: 4165.4,
       askPrice: 4166.4,
       askSize: 23325 } ] }
 */

// 第一次
/**
{ table: 'quote',
  keys: [],
  types:
   { timestamp: 'timestamp',
     symbol: 'symbol',
     bidSize: 'long',
     bidPrice: 'float',
     askPrice: 'float',
     askSize: 'long' },
  foreignKeys: { symbol: 'instrument' },
  attributes: { timestamp: 'sorted', symbol: 'grouped' }
  action: 'partial',
  data:
   [ { timestamp: '2017-09-29T12:00:00.000Z',
       symbol: 'QTUMU17',
       bidSize: null,
       bidPrice: null,
       askPrice: null,
       askSize: null },
     { timestamp: '2017-09-29T12:00:00.000Z',
       symbol: 'XBTU17',
       bidSize: null,
       bidPrice: null,
       askPrice: null,
       askSize: null },
     { timestamp: '2017-09-29T12:00:00.000Z',
       symbol: 'XBJU17',
       bidSize: null,
       bidPrice: null,
       askPrice: null,
       askSize: null },......],
  filter: {} }
 */