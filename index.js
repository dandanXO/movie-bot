const linebot = require('linebot'),
    express = require('express');

const lineSecret = require('./config/linceSecret.json');
const util = require('util');

let bot = linebot({
    channelId: lineSecret.channelId,
    channelSecret: lineSecret.channelSecret,
    channelAccessToken: lineSecret.channelAccessToken
});
const linebotParser = bot.parser(),
    app = express();
bot.on('message', function (event) {
    // 把收到訊息的 event 印出來
    console.log(event);
});
app.post('/webhook', linebotParser);
// 在 localhost 走 8080 port
let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log("My Line bot App running on port", port);
});