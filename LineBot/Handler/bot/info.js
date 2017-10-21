// 版本資訊
const emoji = require('node-emoji');
const moment = require('moment');
const fetch = require('node-fetch');

const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^info$/ig, info);

async function info(event) {
    let perc = Number(100 * walletBalance / goal);
    let str = "[ Info ]\n" +
        `[ Uptime ] ${moment.duration({ seconds: process.uptime() }).humanize()}\n` +
        `[ Node.js Version ] ${process.version}\n` +
        `[ Platform ] ${process.platform}\n` +
        `[ Source Code ] tinyurl.com/ycobwnoh \n`;

    str = str + `[ Donate ]\n`;
    if (perc < 100) {
        str = str +
            `- 此BOT使用Heroku的Free plan，每月只運行550小時\n` +
            `- 有意贊助下個月升級Hobby plan (24hr online)請捐贈任意數目的ETH至以下位置\n` +
            `- 0xa087C9E3eAE348D16B95ea19719c67f77EDa7080\n` +
            `- 當月募款進度 ${walletBalance}/${goal} ETH ( ${perc.toFixed(1)}% )\n` +
            `- 月底未達目標次月初依寄款地址全額退款，無法退款or多餘款項挪至作者口袋\n`;
    } else {
        str = str +
            `- ETH: 0xa087C9E3eAE348D16B95ea19719c67f77EDa7080\n` +
            `- 此BOT使用Heroku的Hobby plan，24hr online\n`;
    }

    str = str +
        `- Line Messenger API使用dev trial，因此此BOT好友數量限制50人`;

    event.reply(str);
    return;
}

/**
 * 使用etherscan.io API查詢錢包餘額
 */

var walletBalance = 0, goal = 0.023;

async function updateWalletBalance() {
    try {
        let res = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=0xa087C9E3eAE348D16B95ea19719c67f77EDa7080&tag=latest&apikey=S518HCWQBFSCA3C9ERQXM4PJTIK45SZFI4')
        res = await res.json();
        if (res.message == 'OK') walletBalance = Number(res.result / 1000000000000000000).toFixed(3);
    } catch (e) {
        console.log(e)
    }
}

setInterval(updateWalletBalance, 10 * 1000);
