const linebot = require('linebot');
const settings = require('./settings');
const fs = require('fs');
const utility = require('./Utility');
const path = require('path');
const settingsFilename = './list.json';
const emoji = require('node-emoji')

/**
 * Initialize
 */

var list = {
    user: [],
    group: [],
    room: [],
};
loadList();

const bot = linebot(settings);
global.list = list;
global.bot = bot;
module.exports = bot;

utility.broadcast(`${emoji.get('umbrella_on_ground')}系統已啟動`);
// 執行BitMEX相關程式
require('../BitMEX/BitMEX_realtime.js'); // 查價功能
// require('../BitMEX/BitMEX_realtimemd.js'); // 成交提醒(未實作)

// 管理line message
const msgHandler_admin = require('./msgHandler_admin'); // admin專用
const msgHandler_list = require('./msgHandler_list'); // 名單
const msgHandler_query = require('./msgHandler_query'); // 使用者查價
const msgHandler_help = require('./msgHandler_help');// 使用說明
const msgHandler_version = require('./msgHandler_version');// 版本資訊

/**
 * process is terminated by Ctrl+C
 */

process.on('exit', (code) => {
    console.log("process was terminated.");
    // 儲存設定
    saveList();
});

process.on('SIGINT', async (code) => {
    // 強制等待
    await utility.delay(500);

    // process離開前通知使用者
    utility.broadcast(`${emoji.get('closed_umbrella')}系統已關閉`);

    // 強制等待
    await utility.delay(500);

    process.exit();
});

/**
 * Load and Store list
 */

function loadList() {
    // 載入清單
    if (fs.existsSync(settingsFilename)) {
        try {
            let fileText = fs.readFileSync(settingsFilename, 'utf8');
            list = JSON.parse(fileText);
            utility.formattedLog('已載入清單');
        } catch (e) {
        }
    }else{
        utility.formattedLog('無清單，使用預設值');
    }
}

function saveList() {
    try {
        fs.writeFileSync(settingsFilename, JSON.stringify(list), 'utf8');
        utility.formattedLog('已儲存清單');
    } catch (e) {
        console.log(e);
    }
}

/**
 * Event
 */

bot.on('message', function (event) {
    switch (event.message.type) {
        case 'text':
            msgHandler_admin(event);
            msgHandler_list(event);
            msgHandler_query(event);
            msgHandler_help(event);
            msgHandler_version(event);
        default:
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