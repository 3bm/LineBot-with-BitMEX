/**
 * 向使用者廣播訊息
 */
function broadcast(text) {
    let userArr, start = 0;
    while ((userArr = global.list.user.slice(start, start + 150)).length > 0) {
        console.log(`廣播人數:${start + userArr.length}/${global.list.user.length}`);

        // 取出Id
        let userIdArr = userArr.map((ele)=>{
            return ele.id;
        });
        
        bot.multicast(userIdArr, text);
        start = start + 150;
    }
}

/**
 * 顯示百分比
 * input: [Float, range:0~100] 超過100顯示為100
 * output: XX.XX%
 */
function print_percentage(perc) {
    let perc_s = perc >= 100 ? Number(100).toFixed(2) : Number(perc).toFixed(2);
    str = '\b'.repeat(8) + ' '.repeat(6 - perc_s.length) + perc_s + ' %';
    if (perc_s == '100.00') str = str + '\n';
    process.stdout.write(str);
}

/**
 * 格式化console.log
 */
function formattedLog(str) {
    const star = "*".repeat(40);
    const padding = str.length > star.length ? 0 : parseInt((star.length - str.length) / 2);
    console.log(star + '\n' + " ".repeat(padding) + str + '\n' + star);
}

/**
 * delay
 */
function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms)
    })
}

module.exports = {
    broadcast,
    print_percentage,
    delay,
    formattedLog

}