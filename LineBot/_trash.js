const wsc_md = require('../BitMEX/BitMEX_realtimemd.js');

// 尋找User在清單內的Idx
function findUserIdx() {
    let userId = event.source.userId;
    if (typeof userId == 'undefined') {
        event.reply("無法取得userId");
        return -1; // 失敗
    } else if (typeof list.user.find((ele) => { return ele.id == userId; }) == "undefined") {
        event.reply("尚未加入清單，請使用bot add指令");
        return -1; // 失敗
    }
    return list.user.findIndex((ele) => { return ele.id == userId; });
}

// 嘗試訂閱
function signal() {
    //.wsc.
}


// bot api [id] [secret]
format = /^bot\sapi\s([\w\-]{24})\s([\w\-]{48})$/ig;
if ((tmp = format.exec(event.message.text)) !== null) {
    let idx = findUserIdx();
    if (idx == -1) return;

    // 使用者輸入的Bitmex API Key&Secret
    let api_key = tmp[1],
        api_secret = tmp[2]; 
    console.log(
    `使用者 ${global.list.user[idx].id} 輸入:\n`+
    `API key = ${api_key}\n`+
    `API secret = ${api_secret}`);

    // 嘗試訂閱
}