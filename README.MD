# BitMEX Line Bot
1. 即時查詢BitMEX合約/Coinmarket所有幣種價格<br/>
Get latest contract details from BitMEX and price of any coin listed on coinmarket by using Line Bot.<br/>

![](./pic/demo)

# 需求 Requirement
* Node.js 
    * version > 7.10
* Line Bot Account 
    * 參考 `LINE BOT 實戰 ( 原理篇 )`

# 安裝 Install
```shell
npm install
```

# 設定 Setting
Add new file named `settings.js` containing the following text under `LineBot` folder.  
```javascript=
module.exports = {
    "channelId": "yourLineBotChannelId",
    "channelSecret": "yourLineBotChannelSecret",
    "channelAccessToken": "yourLineBotChannelAccessToken"
}
```

# 使用方法 Usage

```shell=
ngrok http 3000
```
![](./pic/2-3)

Put "Forward URL" into Line "Webhook URL". Like this:

![](./pic/2-2)

And then:
```shell
npm start
```

# DEMO

QR code of my Line bot:<br/>
![](./pic/0pyMi1TFEu)

Add my bot as a friend and type "bot help" for more information.

# 參考資料 Reference

### LINE BOT
* [linebot](https://github.com/boybundit/linebot)
* [LINE BOT 實戰 ( 原理篇 )](http://www.oxxostudio.tw/articles/201701/line-bot.html)，使用heroku部屬webhook service
* [不必真的架站也能-5-分鐘實機體驗](https://simonhsu.blog/2017/01/25/不必真的架站也能-5-分鐘實機體驗-line-bot-message-api-應用-by-node-js-ngrok/)，使用ngrok+webhook service在本機部屬
* [透過-imgur-api-及-google-cloud-functions-架構超簡易-line-回圖機器人](https://simonhsu.blog/2017/04/06/透過-imgur-api-及-google-cloud-functions-架構超簡易-line-回圖機器人-連圖片流/)
* [LINE BOT 實戰 ( 聊天篇 )](http://www.oxxostudio.tw/articles/201701/line-bot-2.html)
* [LINE devdocs](https://devdocs.line.me/en/#webhook-event-object)
### BitMEX API
* [API Explorer](https://www.bitmex.com/api/explorer/)
* [Websocket API](https://www.bitmex.com/app/wsAPI)
