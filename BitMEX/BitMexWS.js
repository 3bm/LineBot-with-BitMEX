const WebSocket = require('ws');

const handler = require('./BitMexEventHandler');
const ws = new WebSocket('wss://www.bitmex.com/realtime');

var g_BitMex = {
    //未訂閱聊天室，chat和rekt不會有資料
    chat: { 
        en: [], ch:[]
    },
    rekt: [],
    quote: {},
    instrument: {},
};

module.exports = g_BitMex;

/**
 * websocket
 */
ws.on('error', console.error);
ws.on('open', () => {
    log('Connection to BitMEX opened.');
    init();
});
ws.on('close', () => log('Connection closed.'));
ws.on('initialize', () => log('Client initialized, data is flowing.'));

ws.on('message', function incoming(raw) {
    // event handler
    let data = JSON.parse(raw);
    switch (data.table) {
        case "chat":
            handler.chat(data, g_BitMex);
            handler.rekt(data, g_BitMex);
            // console.log(g_BitMex.chatHistory)
            break;
        case "quote":
            handler.quote(data, g_BitMex);
            // console.log(g_BitMex.quote)
            break;
        case "instrument":
            handler.instrument(data, g_BitMex);
            //console.log(raw);
        break;
        default:
    }

});

/**
 * utility function
 */
function log(str) {
    const star = "*".repeat(40);
    const padding = str.length > star.length ? 0 : parseInt((star.length - str.length) / 2);
    console.log(star + '\n' + " ".repeat(padding) + str + '\n' + star);
}

function cmd(op, args = []) {
    return JSON.stringify({ op, args });
}

function subscribe(args) {
    let arr = [];
    for (var i = 0; i < arguments.length; i++) {
        arr.push(arguments[i]);
    }
    return cmd('subscribe', arr)
}

function init() {
    try {
        ws.send(subscribe('quote:XBTUSD', 'quote:XBTU17'));
        ws.send(subscribe('instrument:XBTUSD','instrument:XBTU17'))
    }
    catch (e) {
        log(e)
    }
}
