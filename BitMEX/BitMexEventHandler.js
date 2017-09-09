const fs = require('fs');
const chineseConv = require('chinese-conv');
const emoji = require('node-emoji')

var eventHandler = {};
module.exports = eventHandler;

eventHandler.instrument = function (data, globalObj) {
    if (data.action == 'partial') {
        // initialize
        let r_data = data.data[0];
        globalObj.instrument[r_data.symbol] = r_data;
    } else if (data.action == 'update') {
        // update
        let u_data = data.data[0];
        globalObj.instrument[u_data.symbol] = Object.assign({}, globalObj.instrument[u_data.symbol], u_data);
    }
}


eventHandler.quote = function (data, globalObj) {
    let r_data = data.data[0];
    globalObj["quote"][r_data.symbol] = {
        "timestamp": r_data.timestamp,
        "bidSize": r_data.bidSize,
        "bidPrice": r_data.bidPrice,
        "askPrice": r_data.askPrice,
        "askSize": r_data.askSize,
    }
    // data = {
    //     table: "quote",
    //     action: 'insert',
    //     data: [{
    //         "timestamp": "2017-09-08T04:04:55.098Z", 
    //         "symbol": "XBTUSD",
    //         "bidSize": 2305, 
    //         "bidPrice": 4609.6, 
    //         "askPrice": 4609.7, 
    //         "askSize": 22447
    //     }]
    // }
}

// 紀錄聊天訊息
eventHandler.chat = function (data, globalObj) {
    // record message
    switch (data.data[0].channelID) {
        case 1:
            globalObj.chat.en.push({
                user: data.data[0].user,
                message: chineseConv.tify(data.data[0].message)
            });
            break;
        case 2:
            globalObj.chat.ch.push({
                user: data.data[0].user,
                message: data.data[0].message
            });
            break;
    }

    //console.log(data)
    //globalObj.chatHistory.push(msg);

    // data = {
    //     "table": "chat",
    //     "action": "insert",
    //     "keys": ["id"],
    //     "data": [{
    //         "id": 1518085,
    //         "date": "2017-09-08T04:24:19.223Z",
    //         "user": "Trololobot",
    //         "message": "```\n3 recent REKTS >50k: \n8 hours ago:\nlong XBTUSD -  166943 @ 4575.5 \n11 hours ago:\nlong XBTUSD -  62451 @ 4607.7 \n11 hours ago:\nlong XBTUSD -  165763 @ 4630.9\n```", "html": "<pre><code>3 recent REKTS &gt;50k: <br>8 hours ago:<br>long XBTUSD -  166943 @ 4575.5<br>11 hours ago:<br>long XBTUSD -  62451 @ 4607.7 <br>11 hours ago:<br>long XBTUSD -  165763 @ 4630.9\n</code></pre>",
    //         "fromBot": false,
    //         "channelID": 1
    //     }],
    //     "filterKey": "channelID"
    // }
}

// 複製中文頻道REKT的訊息
eventHandler.rekt = function (data, globalObj) {
    // record message
    if (data.data[0].channelID == 2 && data.data[0].user == 'REKT') {
        
        let str = 
        chineseConv.tify(data.data[0].message) // 簡轉繁
        .replace(/\*\*/g,''); // 刪除"**"(粗體標記)
        
        // 分離出非XBTUSB/XBTU17
        str = str.split('\n');
        str = str.map((ele) => {
            if (ele.indexOf('XBTUSD') != -1 || ele.indexOf('XBTU17') != -1)
                return emoji.emojify(ele, name => name);
        })
        str = str.join('\n'); // 'Wind-Rain-Fire'
        if (!str) return;
        // save
        globalObj.rekt.push({
            user: data.data[0].user,
            message: str
        });
    }
}
module.exports = eventHandler;