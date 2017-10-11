const emoji = require('node-emoji');
const moment = require('moment');

const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^dev$/ig, dev);

// 某Line roomId
const roomId = 'R63938c2fb20cb355190812b78ef8c1c3';

async function dev(event) {
    // console.log(JSON.stringify(event));

    delete event.source.userId;
    event.source.type = "group";
    console.log(event.source);
    try {
        // group、room、user對話皆可取得
        // 有效=>返回 {userId,displayName}
        // 無效=>返回 {"message":"Not found"}
        let profile = await event.source.profile();
        console.log(await event.reply(JSON.stringify(profile)));
    } catch (e) {
        console.log(e);
    }
}