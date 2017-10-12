const tool = require('../Tool/');
const wsc_realtime = require('../BitMEX/BitMEX_realtime.js'); // 查價用
const emoji = require('node-emoji');

class Position {

    constructor(lineUserId) {
        this.position = {};
        this.lineUserId = lineUserId;
    }

    /**
     * public function
     */

    clear() {
        this.position = {};
    }

    add(payload) {

        // check if the payload belongs to position 
        if (payload.table != 'position') return;

        // call the corresponding function
        switch (payload.action) {
            case 'update':
                this.update(payload);
                break;
            case 'insert':
                this.insert(payload);
                break;
            case 'partial':
                this.partial(payload);
                break;
            default:
        }
    }

    /**
     * private funciton
     */

    /**
     * partial - 初始化。處理BitMEX剛訂閱傳送來的第一筆資料。
     */
    partial(payload) {

        payload.data.map((ele) => {
            // 計算收益 (自己算比BitMEX提供的精確度高)
            let profit = tool.profit(ele.currentQty > 0 ? 0 : 1, ele.currentQty, ele.avgCostPrice, ele.markPrice, ele.leverage);
            // 只保留部分資料
            this.position[ele.symbol] = {
                avgCostPrice: ele.avgCostPrice,
                markPrice: ele.markPrice,
                leverage: ele.leverage,
                avgCostPrice: ele.avgCostPrice,
                liquidationPrice: ele.liquidationPrice,
                currentQty: ele.currentQty, // 判斷該合約是否有開倉的依據
                // 紀錄最後一次的標記價格和收益，以便通知使用者收益增減情況
                lastXbtGain: profit.xbtGain,
                lastROE: profit.roe,
                lastMarkPrice: ele.markPrice,
            }
        });

        // 告知使用者目前倉位情況
        this.informUserCurrentPosition();
    }

    /**
     * insert - 使用者開新合約，BitMEX傳送來的該合約的資料格式
     */
    insert(payload) {
        partial(payload);
    }

    update(payload) {

        payload.data.map((ele) => {


            // 剛開倉 currentQty:0 or null -> 非0 ，算一下當前獲利
            if ((!this.position[ele.symbol].currentQty) && ele.currentQty) {

                let profit = tool.profit(
                    ele.currentQty > 0 ? 0 : 1,
                    ele.currentQty,
                    ele.avgCostPrice,
                    ele.markPrice,
                    this.position[ele.symbol].leverage // 取用原來倉位的槓桿
                );

                ele = Object.assign(ele, {
                    lastXbtGain: profit.xbtGain,
                    lastROE: profit.roe,
                    lastMarkPrice: ele.markPrice,
                });
            }

            // 合併新資料進position
            this.position[ele.symbol] = Object.assign(this.position[ele.symbol], ele);

            // 檢查"有開倉 currentQty!=0 or null"的合約收益增減
            if (this.position[ele.symbol].currentQty) this.checkProfit(ele.symbol);
        })

    }

    /**
     * informUserCurrentPosition - 告知使用者目前(有開倉)的倉位狀況
     */
    informUserCurrentPosition() {

        // 統計有開倉的合約數目
        let openingContract = Object.keys(this.position).filter((symbol) => {
            return this.position[symbol].currentQty; // not null or zero
        });

        if (openingContract.length == 0) return;

        let str = `${emoji.get('bread')}持有合約${emoji.get('bread')}\n`;
        openingContract.map((symbol, idx) => {

            let ele = this.position[symbol];

            // 計算收益 
            let profit = tool.profit(ele.currentQty > 0 ? 0 : 1, ele.currentQty, ele.avgCostPrice, ele.markPrice, ele.leverage);

            str = str +
                `[ 　合約　 ] ${symbol}\n` +
                `[ 倉位數量 ] ${ele.currentQty}\n` +
                `[ 開倉價格 ] ${ele.avgCostPrice}\n` +
                `[ 標記價格 ] ${ele.markPrice}\n` +
                `[ 強平價格 ] ${ele.liquidationPrice}\n` +
                `[ 　槓桿　 ] ${ele.leverage} x\n` +
                `[ 目前獲利 ] ${profit.roe > 0 ? '+' : ''}${Number(profit.xbtGain).toFixed(4)} XBT\n` +
                `  　　　　   ${profit.roe > 0 ? '+' : ''}${Number(profit.roe).toFixed(2)} %\n` +
                ((idx == openingContract.length - 1) ? '' : '\n');
        });

        bot.push(this.lineUserId, str);
    }

    /**
     * informUserUpdatedPosition - 告知使用者漲跌情況
     */
    informUserUpdatedPosition(symbol) {
        let data = this.position[symbol];

        // 提醒使用者收益增減
        let str;
        let profit_markPrice = tool.profit(data.currentQty > 0 ? 0 : 1, data.currentQty, data.avgCostPrice, data.markPrice, data.leverage);

        if (profit_markPrice.roe > data.lastROE) {
            str = `[ 　合約　 ] ${symbol}  收益 +${Number(profit_markPrice.roe - data.lastROE).toFixed(2)} %\n`;
        } else {
            str = `[ 　合約　 ] ${symbol}  收益 ${Number(profit_markPrice.roe - data.lastROE).toFixed(2)} %\n`;
        }

        str = str + `[ 倉位數量 ] ${data.currentQty}\n`;

        if (data.markPrice > data.lastMarkPrice) {
            str = str + `[ 標記價格 ] ${data.markPrice} (+${Number(data.markPrice - data.lastMarkPrice).toFixed(2)}) ${emoji.get('arrow_up')}\n`;
        } else {
            str = str + `[ 標記價格 ] ${data.markPrice} (${Number(data.markPrice - data.lastMarkPrice).toFixed(2)}) ${emoji.get('arrow_down')}\n`;
        }

        if (profit_markPrice.roe > data.lastROE) {
            // 修正IEEE 754 顯示的-0.0000
            let xbtGain = Number(profit_markPrice.xbtGain - data.lastXbtGain).toFixed(4);
            if (xbtGain === '-0.0000') xbtGain = '0.0000';

            str = str +
                `[ 開倉價格 ] ${data.avgCostPrice}\n` +
                `[ 強平價格 ] ${data.liquidationPrice}\n` +
                `[ 目前獲利 ] ${Number(profit_markPrice.xbtGain).toFixed(4)} XBT (+${xbtGain} XBT)\n` +
                `  　　　　   ${Number(profit_markPrice.roe).toFixed(2)} % (+${Number(profit_markPrice.roe - data.lastROE).toFixed(2)}%)`;
        } else {
            str = str +
                `[ 開倉價格 ] ${data.avgCostPrice}\n` +
                `[ 強平價格 ] ${data.liquidationPrice}\n` +
                `[ 目前獲利 ] ${Number(profit_markPrice.xbtGain).toFixed(4)} XBT (${Number(profit_markPrice.xbtGain - data.lastXbtGain).toFixed(4)} XBT)\n` +
                `  　　　　   ${Number(profit_markPrice.roe).toFixed(2)} % (${Number(profit_markPrice.roe - data.lastROE).toFixed(2)}%)`;
        }

        // 通知使用者
        bot.push(this.lineUserId, str);
    }

    /**
     * checkProfit - 現在收益與過去比較是否超出臨界值
     */
    checkProfit(symbol) {

        let data = this.position[symbol];

        // 取得BitMEX目前合約資料
        let matched = wsc_realtime.quote.find((ele) => {
            return ele.symbol == data.symbol;
        });

        // 獲利計算
        let profit_askPrice = tool.profit(data.currentQty > 0 ? 0 : 1, data.currentQty, data.avgCostPrice, matched.askPrice, data.leverage),
            profit_bidPrice = tool.profit(data.currentQty > 0 ? 0 : 1, data.currentQty, data.avgCostPrice, matched.bidPrice, data.leverage),
            profit_markPrice = tool.profit(data.currentQty > 0 ? 0 : 1, data.currentQty, data.avgCostPrice, data.markPrice, data.leverage);

        // 依據上次標記價格作為基準與這次比較
        const bound = 10.0; // %,標記價格浮動門檻   
        if (
            (profit_markPrice.roe <= data.lastROE - bound)
            ||
            (profit_markPrice.roe >= data.lastROE + bound)
        ) {
            // 通知使用者
            this.informUserUpdatedPosition(symbol);

            // 紀錄觸發門檻時的資訊
            data.lastXbtGain = profit_markPrice.xbtGain;
            data.lastROE = profit_markPrice.roe;
            data.lastMarkPrice = data.markPrice;
        }
    }
}

module.exports = Position;