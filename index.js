var express = require('express');
var linebot = require('./LineBot/');

const app = express();
const linebotParser = linebot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("[SYS] App now running on port", port);
});

