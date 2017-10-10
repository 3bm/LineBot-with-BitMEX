// 過濾非bot開頭的使用者輸入
const wrapper = require('../wrapper.js');
const help = require('./help.js');
const version = require('./version.js');
const query = require('./query.js');
const dev = require('./dev.js');
const watch = require('./watch/');

module.exports = new wrapper(/^bot\s(.+)$/ig, bot);

function bot(event, matchedStr) {
    watch.test(event, matchedStr) ||
        help.test(event, matchedStr) ||
        version.test(event, matchedStr) ||
        dev.test(event, matchedStr) ||
        query.test(event, matchedStr); // query接收所有字元，務必放在最尾端

}
