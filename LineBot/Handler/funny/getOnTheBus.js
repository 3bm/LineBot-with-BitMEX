const wrapper = require('../wrapper.js');
const moment = require('moment');

module.exports = new wrapper(/上車/u, main);

const imgURL = ['https://i.imgur.com/RSpmMOb.jpg',
    'https://i.imgur.com/p5A9wye.jpg',
    'https://i.imgur.com/H0rHTvr.jpg',
    'https://i.imgur.com/Cu3tIIy.jpg'];

var lastCallTimestamp = moment(0);

function main(event) {
    // 限制n秒才能使用一次
    if (moment().diff(lastCallTimestamp, 'minutes') > 10) {
        lastCallTimestamp = moment();

        let url = imgURL[parseInt(Math.random() * imgURL.length)];

        event.reply({
            type: 'image',
            originalContentUrl: url,
            previewImageUrl: url
        });
    }

}
