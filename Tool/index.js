// 合约数量 * 乘数 * (1/开仓价格 - 1/平仓价格)
// 投资者做多 100 XBT 等值的比特币，价格为 600 美元，他就做多了 100XBT * 600 USD = 60000 张合约，几天后合约价格上升到 700 美元。
//
// 投资者的利润将是︰ 60,000 * 1 * (1/600 - 1/700) = 14.286 XBT
//
// 如果价格实际上已经下降到 500 美元，投资者的损失将会是︰ 60,000 * 1 * (1/600-1/500) =-20 XBT。 由于合约的倒数和非线性性质，损失也较大。 相反，对于做空的投资者来说，以比特币计算的话，下跌的利润将会比同样幅度上升所导致的亏损较大。

/**
 * 倉位,sell=1/buy=0,開倉價格,平倉價格,槓桿
 */
function profit(mode, qty, openPrice, closePrice, leverage) {
    // 價值
    let value = qty / openPrice;
    // 開倉所需XBT
    let xbtCost = qty / (openPrice * leverage);
    // 盈餘
    let xbtGain = qty * (mode ? -1 : 1) * (1 / openPrice - 1 / closePrice);
    return {
        xbtGain: Number(xbtGain),
        roe: Number(100 * xbtGain / xbtCost),
    }
}

module.exports = {
    profit,
}

