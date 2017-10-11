const wrapper = require('../wrapper.js');

module.exports = new wrapper(/神奇海螺/u, magicConch);

function magicConch(event) {
    event.reply({
        type: 'image',
        originalContentUrl: 'https://i.imgur.com/zTlEqF9.jpg',
        previewImageUrl: 'https://i.imgur.com/zTlEqF9.jpg'
    });
}
