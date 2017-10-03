# 開發筆記
# event.source找不到userId? 
```javascript
// without userId
{
  "source": {
    "type": "group",
    "groupId": "Ca56f94637cc4347f90a25382909b24b9"
  },
}

// normal
{
  "source": {
    "type": "group",
    "groupId": "Ca56f94637cc4347f90a25382909b24b9",
    "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
  },
}
{
    "source": {
        "type":"user",
        "userId":"Ud14d4a2d758acb05cc86df1a4f1279c7"
    }
}

```
- [需要使用者提供consent](https://developers.line.me/en/docs/messaging-api/user-consent/)
- 與BOT第一次交談會出現同意使用條款，同意後後以後與其他BOT交談便不會出現。
- 7.5.0以下的使用者每次加入BOT為好友/邀請加入對話都會出現同意條款。

# Difference between room and group
https://developers.line.me/en/docs/messaging-api/group-chats/

# DOC連結
https://github.com/boybundit/linebot
https://developers.line.me/en/docs/messaging-api/overview/
https://developers.line.me/en/docs/messaging-api/reference/

# 管理頁面
https://developers.line.me/console/channel/1538431072/basic/