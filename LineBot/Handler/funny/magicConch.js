const wrapper = require('../wrapper.js');
const moment = require('moment');

module.exports = new wrapper(/神奇海螺/u, main);

var lastCallTimestamp = moment(0);

function main(event) {
    // 限制n秒才能使用一次
    if (moment().diff(lastCallTimestamp, 'seconds') > 30) {
        lastCallTimestamp = moment();

        event.reply({
            type: 'image',
            originalContentUrl: 'https://i.imgur.com/zTlEqF9.jpg',
            previewImageUrl: 'https://i.imgur.com/zTlEqF9.jpg'
        });
    }
}
