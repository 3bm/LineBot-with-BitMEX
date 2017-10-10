// 版本資訊
// Warning: Linux: In some cases you need to install the linux sensors package to be able to measure temperature e.g. on DEBIAN based systems by running sudo apt-get install lm-sensors
const emoji = require('node-emoji');
const moment = require('moment');
const si = require('systeminformation');

const wrapper = require('../wrapper.js');
module.exports = new wrapper(/^version$/ig, version);

async function version(event) {
    const cpuTemperature = await si.cpuTemperature();
    const platform = process.platform;

    let versionStr = "[ Version Info ]\n" +
        "Last Update: 2017/09/30 \n" +
        `Uptime: ${moment.duration({ seconds: process.uptime() }).humanize()}\n` +
        `CPU Temp: ${platform == 'linux' ? cpuTemperature.main + ' °C' : 'Unsupport'}\n` +
        `Process PID: ${process.pid}\n` +
        `Node.js Version: ${process.version}\n` +
        `Platform: ${platform}\n` +
        "Source Code: somewhere";

    event.reply(versionStr);
}



