// class User的方法常和wsc,global.bot,class Stream交錯使用，有點雜
const Stream = require('./Stream.js');
const fetch = require('node-fetch');
const moment = require('moment');
const crypto = require('crypto');
const wsc = require('../BitMEX/BitMEX_realtimemd.js');
const fs = require('fs');
const calTool = require('../Tool/');
const wsc_realtime = require('../BitMEX/BitMEX_realtime.js'); // 查價用
const emoji = require('node-emoji');

const boundUnit = 2.50; // 標記價格浮動門檻，超過通知使用者

class User extends Stream {
    /**
     * User資料模型
     * @param {number} id - 該User的Line userId
     */
    constructor(lineUserId, apikey = null, secret = null, status = 0) {
        super(status);
        this.lineUserId = lineUserId;
        this.apikey = apikey;
        this.secret = secret;
        this.mutex = false;// start&stop&verifykey的mutex
        // 使用者的BitMEX資料:execution,position,liquidation...
        this.position = null;
        this.execution = null;
    }

    /**
     * 產生BitMEX認證所需的signature
     */
    genSignature(VERB, PATH, NONCE, API_SECRET) {
        return crypto
            .createHmac('sha256', API_SECRET)
            .update(VERB + PATH + NONCE)
            .digest('hex');
    }

    /**
     * CheckROE - 與上次的收益對照並通知使用者
     */
    ckeckROE(symbol) {
        // 取得目前價格
        let matched = wsc_realtime.quote.find((ele) => {
            return ele.symbol == symbol;
        });
        // if (!matched) return;

        // 獲利計算
        let idx = this.position.findIndex((ele) => {
            return ele.symbol == symbol;
        });

        let ele = this.position[idx];
        let roe_ask = calTool.roe(ele.openingCost < 0 ? 0 : 1, ele.openingQty, ele.avgCostPrice, matched.askPrice, ele.leverage);
        let roe_bid = calTool.roe(ele.openingCost < 0 ? 0 : 1, ele.openingQty, ele.avgCostPrice, matched.bidPrice, ele.leverage);
        let roe_mark = calTool.roe(ele.openingCost < 0 ? 0 : 1, ele.openingQty, ele.avgCostPrice, ele.markPrice, ele.leverage);

        // 提醒使用者
        let notify = () => {
            let profitDiff = Number(roe_mark.roe - ele.lastMarkROE).toFixed(2);
            let str;
            if (profitDiff > 0) {
                str = `${emoji.get('arrow_up')}獲利上升 ${profitDiff} % ${emoji.get('arrow_up')}\n`
            } else {
                str = `${emoji.get('arrow_down')}獲利下降 ${profitDiff} % ${emoji.get('arrow_down')}\n`
            }
            str = str + `[ 標記價格 ] ${ele.lastMarkPrice} -> ${ele.markPrice} \n\n`;

            str = str +
                `[ Symbol ] ${ele.symbol}\n` +
                `[ 開倉價格 ] ${ele.avgCostPrice}\n` +
                `[ 　槓桿　 ] ${ele.leverage}\n` +
                `[ 強平價格 ] ${ele.liquidationPrice}\n` +
                `[ 　獲利　 ]\n` +
                `${emoji.get('cloud')}Ask : ${roe_ask.xbtGain} XBT, ${roe_ask.roe} %\n` +
                `${emoji.get('cloud')}Bid : ${roe_bid.xbtGain} XBT, ${roe_bid.roe} %\n` +
                `${emoji.get('cloud')}Mark: ${roe_mark.xbtGain} XBT, ${roe_mark.roe} %`;

            bot.push(this.lineUserId, str);
        }

        // 依據標記價格作為提醒依據
        let change = false;
        while (ele.roeUpperBound < roe_mark.roe) {
            // 超過上限，門檻往上調
            ele.roeUpperBound = ele.roeUpperBound + boundUnit;
            ele.roeLowerBound = ele.roeLowerBound + boundUnit;
            change = true;
        }
        while (ele.roeLowerBound > roe_mark.roe) {
            // 超過下限，門檻往下調
            ele.roeUpperBound = ele.roeUpperBound - boundUnit;
            ele.roeLowerBound = ele.roeLowerBound - boundUnit;
            change = true;
        }
        // 提醒使用者
        if (change) {
            notify();
            // 紀錄觸發門檻時的標記價格
            ele.lastMarkROE = roe_mark.roe;
            ele.lastMarkPrice = ele.markPrice;
        }
    }

    /**
     * Auth - 在已開啟的stream上發送auth request
     * 用法: await auth()
     */
    auth() {
        return new Promise((resolve, reject) => {
            // key & secret are empty?
            if (!(this.apikey && this.secret)) resolve(false);

            // 產生signature
            var nonce = moment().format('x');
            var signature = this.genSignature('GET', '/realtime', nonce, this.secret);

            // 收到response後才算完成整個動作
            this.onmsg = (payload) => {
                console.log(`[SYS] Auth response from Stream ( ID=${this.streamId} TOPIC=${this.streamTopic} )`);
                this.onmsg = null;

                // 認證成功
                if (payload.success && payload.success == true) return resolve(true);

                // 認證失敗，清除已失效的api key *認證失敗BitMEX會主動關閉該數據流
                this.apikey = null;
                this.secret = null;
                return resolve(false);
            }

            // 發送請求
            this.send("authKey", [this.apikey, Number(nonce), signature]);
        });
    }

    /**
     * Subscribe - 在已開啟的stream(且通過authorize)發送subscribe request
     * 用法: await subscribe()
     */
    subscribe() {
        return new Promise((resolve, reject) => {

            // 收到response後才算完成整個動作
            this.onmsg = (payload) => {
                console.log(`[SYS] Subscription response from Stream ( ID=${this.streamId} TOPIC=${this.streamTopic} )`);
                this.onmsg = null;

                // success
                if (payload.success && payload.success == true) return resolve(true);

                // failed
                return resolve(false);
            }

            // 發送請求
            this.send("subscribe", ['position']);
        });
    }

    /**
     * --------------- 給User直接操作的指令 ----------------
     */

    /**
     * Start - open stream & subscribe & receive important data
     * usage: await start()
     */
    async start() {
        // mutex
        if (this.mutex) return this.tellUser('請等待上一個動作完成');
        this.mutex = true;

        this.tellUser(`Starting...`);

        await this.open();
        if (!await this.auth()) {
            // auth failed, closing current stream
            this.tellUser('Authorization Failed. Service will automatically stop immediately.');

            this.mutex = false;
            return await this.stop();
        } else if (!await this.subscribe()) {
            // subscribe failed
            this.tellUser('Subscription Failed. Service will automatically stop immediately.');

            this.mutex = false;
            return await this.stop();
        } else {
            // Everthing is ok, set message handler.
            this.onmsg = async (payload) => {
                if (payload.error) {
                    // 收到error，可能是api key被刪除，通知user後關閉stream
                    this.tellUser('Access Token expired for subscription. Service will automatically stop immediately.');
                    this.onmsg = null;
                    await this.stop();
                } else {
                    // 若無error呼叫對應function處理payload
                    if (payload.table == 'position') {

                        if (payload.action == 'partial') {
                            // 初始化postion，且只保留部分資料
                            this.position = payload.data.filter(function (x) {
                                return x.avgCostPrice;
                            }).map((ele) => {
                                // 必要資料
                                return {
                                    symbol: ele.symbol,
                                    avgCostPrice: ele.avgCostPrice,
                                    markPrice: ele.markPrice,
                                    leverage: ele.leverage,
                                    openingCost: ele.openingCost,
                                    openingQty: ele.openingQty,
                                    avgCostPrice: ele.avgCostPrice,
                                    liquidationPrice: ele.liquidationPrice,
                                    // 收益門檻，以便通知使用者，初始值為+-boundUnit
                                    roeUpperBound: boundUnit,
                                    roeLowerBound: -boundUnit,
                                    lastMarkROE: 0.0,
                                    lastMarkPrice: ele.avgCostPrice,
                                };
                            });

                            // 告知使用者目前倉位情況
                            let str = `${emoji.get('shamrock')}持有合約${emoji.get('shamrock')}\n`;
                            this.position.map((ele, idx) => {
                                str = str +
                                    `[ Symbol ] ${ele.symbol}\n` +
                                    `[ 開倉價格 ] ${ele.avgCostPrice}\n` +
                                    `[ 標記價格 ] ${ele.markPrice}\n` +
                                    `[ 　槓桿　 ] ${ele.leverage}\n` +
                                    `[ 強平價格 ] ${ele.liquidationPrice}\n` +
                                    ((idx == this.position.length - 1) ? '' : '\n');
                            });
                            bot.push(this.lineUserId, str);

                        } else if (payload.action == 'update') {
                            // 倉位更新

                            // 合併新資料
                            let data = payload.data[0];
                            if (this.position === null) { // 不曉得為何第一次會取到null
                                console.log(idx, this.position);
                            }
                            let idx = this.position.findIndex((ele) => {
                                return ele.symbol == data.symbol;
                            });
                            this.position[idx] = Object.assign(this.position[idx], data);

                            // 與歷史紀錄對照
                            this.ckeckROE(data.symbol);
                        }
                    }
                    if (payload.table == 'execution') {
                        // 省略~
                    }
                }
            };
        }

        this.tellUser(`Done!`);

        // mutex
        this.mutex = false;
    }

    /**
    * Stop - close stream & inform user
    * usage: await stop()
    */
    async stop() {
        // mutex
        if (this.mutex) return this.tellUser('請等待上一個動作完成');
        this.mutex = true;

        this.tellUser(`Stopping...`);
        await this.close();
        this.tellUser(`Done!`);

        // mutex
        this.mutex = false;
    }

    /**
     * 驗證使用者輸入的API Key& secret - 以node-fetch驗證是否有效並儲存
     */
    async verifyKey(apikey, secret) {
        // mutex
        if (this.mutex) return this.tellUser('請等待上一個動作完成');
        this.mutex = true;

        this.tellUser('Verifying...');

        // 產生nonce和signature
        var url = '/api/v1//user/affiliateStatus'; // 隨便一個需要使用者授權的api
        let nonce = moment().format('x');
        let signature = this.genSignature('GET', url, nonce, secret);

        // 透過api抓資料
        var res = await fetch('https://www.bitmex.com' + url, {
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json',
                'api-key': apikey,
                'api-nonce': nonce,
                'api-signature': signature,
            }
        });
        res = await res.json();

        // mutex
        this.mutex = false;

        // 無效
        if (res.error) return this.tellUser('API key or secret is invalid.');


        // 有效，儲存
        this.apikey = apikey;
        this.secret = secret;
        return this.tellUser('API key and secret is valid, both are saved.');
    }

    /**
     * TellUser
     */
    tellUser(msg) {
        console.log(`[Msg] To User '${this.lineUserId}', [Stream ID] '${this.streamId}', [text] ${msg} `);
        bot.push(this.lineUserId, msg);
    }
}


module.exports = User;



/**
 * onmessage - 處理BitMEX傳過來的資料
 * 從BitMEX接受到的訊息格式為[<type>,<streamId>,<topic>,<payload>]
 * UserPool裡面的每一個User都有unique streamId
 */
wsc.onmessage = function (raw) {
    if (process.env.NODE_ENV === 'debug') console.log('[Debug]: ', raw);

    var userPool = global.userPool;
    var data = JSON.parse(raw);
    var type = data[0],
        streamId = data[1],
        topic = data[2],
        payload = data[3];

    // 依照type不同進行處理    
    if (type == 2) {
        // Server確認關閉Stream，尋找對應的stream obj
        userPool.map((user) => {
            // onclose()
            if (user.streamId == streamId && typeof user.onclose == 'function') {
                user.onclose();
            }
        })
    } else if (type == 0 && typeof payload.info == 'string' && payload.info.includes("Welcome")) {
        // Server確認開啟stream，傳來歡迎訊息，尋找對應的stream obj
        userPool.map((user) => {
            // onopen()
            if (user.streamId == streamId && typeof user.onopen == 'function') {
                user.onopen();
            }
        })
    } else if (type == 0) {
        // Server傳來一般訊息，尋找對應的stream obj
        userPool.map((user) => {
            // onmsg(payload)
            if (user.streamId == streamId && typeof user.onmsg == 'function') {
                user.onmsg(payload);
            }
        })
    } else {
        // 例外
        console.log('[Warning] unknown format: ', raw);
    }
}