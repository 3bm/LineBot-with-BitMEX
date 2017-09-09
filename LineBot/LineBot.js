var linebot = require('linebot');
var userInputHandler = require('./userInputHandler');
var _broadcast = require('./Broadcast');

var settings = require('./settings');

var g_BitMex = require('../BitMEX/BitMexWS'); // g_BitMex為最新的BitMEX回傳的資訊

/**
 * Variable
 */

var idList = [
    // {
    //     id: xxx,
    //     brodcast: {
    //         rekt: false,
    //     }
    // }
];

/**
 * Init
 */

var bot = linebot(settings);
var broadcast = new _broadcast(idList,g_BitMex);
module.exports = bot;

setInterval(() => {
    broadcast.rekt();
}, 1000);

/**
 * Event
 */

bot.on('message', function (event) {
    switch (event.message.type) {
        case 'text':
            new userInputHandler(event, g_BitMex)
                .instrument()
                .help();
            break;
        default:
    }
});

bot.on('follow', function (event) {
    // event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
    // event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
    // event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
    // event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
    // event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
    // event.reply('beacon: ' + event.beacon.hwid);
});
