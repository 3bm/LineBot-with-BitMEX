// 使用說明
const wrapper = require('../wrapper.js');
const emoji = require('node-emoji');
const fs = require('fs');
const path = require('path');
const helpText = fs.readFileSync(path.resolve(__dirname,'helpText.txt'),'utf8');

module.exports = new wrapper(/^help$/ig, help);

function help(event) {
    event.reply(helpText);
}