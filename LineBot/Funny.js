// 神奇海螺 message object
module.exports.magicConch = {
    type: 'image',
    originalContentUrl: 'https://i.imgur.com/zTlEqF9.jpg',
    previewImageUrl: 'https://i.imgur.com/zTlEqF9.jpg'
}

if (/神奇海螺/ig.exec(event.message.text) !== null) {
    event.reply(magicConch);
}