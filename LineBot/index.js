const linebot = require('linebot');
const settings = require('./settings');
const fs = require('fs');
const path = require('path');
const emoji = require('node-emoji')

/**
 * Initialize LineBot
 */
const bot = linebot(settings);
global.bot = bot;
module.exports = bot;

// 執行BitMEX相關程式
require('../BitMEX/BitMEX_realtime.js').open('wss://www.bitmex.com/realtime'); // 查價功能
require('../BitMEX/BitMEX_realtimemd.js').open('wss://www.bitmex.com/realtimemd'); // 成交提醒
require('../BitMEX/GroupLiquidationNotice.js'); // 爆倉提醒

/**
 * Event
 */
const handler_bot = require('./Handler/bot/');
const handler_funny = require('./Handler/funny/');
bot.on('message', function (event) {
    if (event.message.type == 'text') {
        handler_bot.test(event, event.message.text);
        // handler_funny.test(event, event.message.text);
    }
});

/**
 * Unused event
 */
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

