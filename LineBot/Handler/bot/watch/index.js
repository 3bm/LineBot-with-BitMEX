const wrapper = require('../../wrapper.js');
module.exports = new wrapper(/^watch\s(.+)$/ig, watch);

const start = require('./start');
const stop = require('./stop');
const api = require('./api');
const debug = require('./debug');

function watch(event, matchedStr) {

    if (event.source.roomId || event.source.groupId) {
        event.reply('此指令不可在room或group中使用');
    } else if (typeof event.source.userId == 'undefined') {
        event.reply('無法取得userId，請更新至Line最新版');
    } else {
        debug.test(event, matchedStr) ||
        start.test(event, matchedStr) ||
            stop.test(event, matchedStr) ||
            api.test(event, matchedStr);
    }

}