// class User的方法常和wsc,global.bot,class Stream交錯使用，有點雜
const Stream = require('./Stream.js');
const Position = require('./Position.js');
const Execution = require('./Execution.js');

const fetch = require('node-fetch');
const moment = require('moment');
const crypto = require('crypto');
const emoji = require('node-emoji');
const fs = require('fs');

const wsc = require('../BitMEX/BitMEX_realtimemd.js');

class User extends Stream {
    /**
     * User資料模型
     * @param {number} id - 該User的Line userId
     */
    constructor(lineUserId, apikey = null, secret = null, status = 0, bound = 5.0) {
        super(status);
        this.lineUserId = lineUserId;
        this.apikey = apikey;
        this.secret = secret;
        this.bound = bound; // %,標記價格浮動門檻 
        this.mutex = false;// start & stop & verifykey 的mutex
        // BitMEX回傳的個人資料:execution,position...
        this.position = new Position(lineUserId);
        this.execution = new Execution(lineUserId);
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

            // clear previous data
            this.position.clear();

            // 收到response後才算完成整個動作
            this.onmsg = (payload) => {
                console.log(`[SYS] Subscription response from Stream ( ID=${this.streamId} TOPIC=${this.streamTopic} )`);
                this.onmsg = null;

                // success
                if (payload.success && payload.success == true) return resolve(true);

                // BitMEX可能略過success訊息直接傳data
                if (payload.table == 'position') {
                    this.position.add(payload);
                    return resolve(true);
                }

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
     * @param {number} bound - position物件的bound參數，使用者指定的標記價格浮動門檻
     */
    async start(bound) {
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

            // Save bound
            try {
                bound = Number(bound);
                if (bound > 0) this.bound = bound;
            } catch (e) {
                // Bound is NaN, do nothing
            }
            // Set bound
            this.position.setBound(this.bound);

            // Set message handler.
            this.onmsg = async (payload) => {

                if (payload.error) {
                    // 收到error，可能是api key被刪除，通知user後關閉stream
                    this.tellUser('Access Token expired for subscription. Service will automatically stop immediately.');
                    this.onmsg = null;
                    await this.stop();
                } else {
                    // 若無error呼叫對應function處理payload
                    if (payload.table == 'position') {
                        this.position.add(payload);
                    } else if (payload.table == 'execution') {
                        this.execution.add(payload);
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