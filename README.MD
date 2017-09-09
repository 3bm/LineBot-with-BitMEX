# BitMEX Line Bot
即時查詢BitMEX XBTUSD/XBTU17當前資訊

# 需求
* node.js 
    * version > 7.10
* Line bot 帳號 
    * 參考 `LINE BOT 實戰 ( 原理篇 )`
# 使用方法
#### 1. 新增/LineBot/settings.js，內容為
```javascript=
module.exports = {
    "channelId": "xxxxx",
    "channelSecret": "xxxxxx",
    "channelAccessToken": "xxxxxxx"
}
```
#### 2. 啟動Bot
```javascript=
npm i
npm start
```
![](./pic/2-1)

```shell=
ngrok http 3000
```
 參考 `不必真的架站也能-5-分鐘實機體驗`
![](./pic/2-3)
 
![](./pic/2-2)


# DEMO
![](./pic/demo)

# 參考資料
* [linebot](https://github.com/boybundit/linebot)
* [LINE BOT 實戰 ( 原理篇 )](http://www.oxxostudio.tw/articles/201701/line-bot.html)
> 使用heroku部屬webhook service
* [不必真的架站也能-5-分鐘實機體驗](https://simonhsu.blog/2017/01/25/不必真的架站也能-5-分鐘實機體驗-line-bot-message-api-應用-by-node-js-ngrok/)
> 使用ngrok+webhook service在本機部屬
* [透過-imgur-api-及-google-cloud-functions-架構超簡易-line-回圖機器人](https://simonhsu.blog/2017/04/06/透過-imgur-api-及-google-cloud-functions-架構超簡易-line-回圖機器人-連圖片流/)
* [LINE BOT 實戰 ( 聊天篇 )](http://www.oxxostudio.tw/articles/201701/line-bot-2.html)
* [LINE devdocs](https://devdocs.line.me/en/#webhook-event-object)

