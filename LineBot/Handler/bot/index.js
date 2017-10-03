// 過濾非bot開頭的使用者輸入
const wrapper = require('../wrapper.js');

const listAddedUser = require('./listAddedUser.js');
const add = require('./add.js');
const remove = require('./remove.js');
const help = require('./help.js');
const version = require('./version.js');
const query = require('./query.js');
const dev = require('./dev.js');

module.exports = new wrapper(/^bot\s(.+)$/ig, bot);

function bot(event, matchedStr) {
    // if matched, is true
    listAddedUser.test(event, matchedStr) ||
        add.test(event, matchedStr) ||
        remove.test(event, matchedStr) ||
        help.test(event, matchedStr) ||
        version.test(event, matchedStr) ||
        dev.test(event, matchedStr) ||
        query.test(event, matchedStr); // query接收所有字元，務必放在最尾端
}
