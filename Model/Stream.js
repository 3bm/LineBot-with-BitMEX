const wsc = require('../BitMEX/BitMEX_realtimemd.js');
/**
* status 4種狀態
* 0 = wait/closed 
* 1 = connecting 
* 2 = connected 
* 3 = disconnecting
*/
const CLOSED = 0,
    WAIT = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    DISCONNECTING = 3;

/**
 * Stream - 給User.js繼承，使User具有透過websocket (wsc)傳送資料的能力
 * BitMEX的訊息格式為[<type>,<streamId>,<topic>,<payload>]
 */
class Stream {
    constructor(status=0) {
        this.status = status;
        this.streamId = null;
        this.streamTopic = null;

        // 處理server傳來stream剛開啟和關閉stream訊息的function
        this.onopen = null;
        this.onclose = null;
        // 處理建立stream後Server傳來的訊息
        this.onmsg = null;
    }

    static resetStreamId() {
        Stream.streamIdCounter = 0;
    }

    /**
     * 建立與Server之間的stream
     * 用法: await open();
     */
    open() {
        return new Promise((resolve, reject) => {
            // prevent open twice
            if (this.status != WAIT || this.status != CLOSED) return resolve();

            // 產生新streamId和streamTopic
            this.streamId = (Stream.streamIdCounter = Stream.streamIdCounter + 1); // 產生遞增的streamId
            this.streamTopic = '_' + this.streamId;

            // 連線中
            this.status = CONNECTING;

            this.onopen = () => {
                console.log(`[SYS] Stream ( ID=${this.streamId} TOPIC=${this.streamTopic} ) has opened.`);
                // Server確認建立stream
                this.status = CONNECTED;
                this.onopen = null;
                resolve();
            }

            // 送出請求後等待Server回應
            wsc.send(JSON.stringify([1, this.streamId, this.streamTopic]));
        })
    }

    /**
     * 關閉與Server之間的stream
     * 用法: await close();
     */
    close() {
        return new Promise((resolve, reject) => {
            // prevent close twice
            if (this.status != CONNECTED) return resolve();

            // 關閉連線中
            this.status = DISCONNECTING;

            this.onclose = () => {
                console.log(`[SYS] Stream ( ID=${this.streamId} TOPIC=${this.streamTopic} ) has closed.`);
                // Server確認關閉stream
                this.status = CLOSED;
                this.streamId = null; // 清除streamId和streamTopic
                this.streamTopic = null;
                this.onclose = null;
                resolve();
            }

            // 送出請求後等待Server回應
            wsc.send(JSON.stringify([2, this.streamId, this.streamTopic]));
        })
    }

    /**
     * 在已開啟的stream上傳送資料
     * @param {object} op - operation
     * @param {array} args - args
     */
    send(op, args = []) {
        let payload = JSON.stringify([0, this.streamId, this.streamTopic, { op, args }]);
        wsc.send(payload);
    }
}

// 產生不重複的streamId所需要使用的counter
Stream.streamIdCounter = 0;

module.exports = Stream;