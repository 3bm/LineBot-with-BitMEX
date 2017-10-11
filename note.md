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

# Line DOC連結
https://github.com/boybundit/linebot
https://developers.line.me/en/docs/messaging-api/overview/
https://developers.line.me/en/docs/messaging-api/reference/

# Line 管理頁面
https://developers.line.me/console/channel/1538431072/basic/

# 使用Regexp global小事項
https://siderite.blogspot.com/2011/11/careful-when-reusing-javascript-regexp.html

# Unicode on Regexp using es6
https://mathiasbynens.be/notes/es6-unicode-regex

# js static member
https://stackoverflow.com/questions/1535631/static-variables-in-javascript

http://usejsdoc.org/tags-param.html

https://robertnyman.com/2008/10/14/javascript-how-to-get-private-privileged-public-and-static-members-properties-and-methods/

wired,prototype並不適合實作static member

# js的static variable還在草擬階段
http://2ality.com/2015/02/es6-classes-final.html
這篇看不到static variable的用法
https://stackoverflow.com/questions/28445693/how-do-i-make-a-public-static-field-in-an-es6-class
在Stage 2有提到