const linebot = require('linebot'),
    express = require('express');

const lineSecret = require('./config/linceSecret.json');
const util = require('util');
const https = require('https');
const fs = require('fs');
var keyPath = './config/private.key';
var certPath = './config/certificate.pem';
var hskey = fs.readFileSync(keyPath);
var hscert = fs.readFileSync(certPath);

let bot = linebot({
    channelId: lineSecret.channelId,
    channelSecret: lineSecret.channelSecret,
    channelAccessToken: lineSecret.channelAccessToken
});


const linebotParser = bot.parser();
const  app = express();
bot.on('message', function (event) {
    // 把收到訊息的 event 印出來
    console.log(event);
});

app.post('/webhook', linebotParser);
app.get('/test',(req, res)=>{
    res.send('ssl test')
})
// 在 localhost 走 ssl 443 port

const server = https.createServer({
    key: hskey,
    cert:hscert
},app)
server.listen(process.env.PORT || 443, '192.168.0.100',()=>{
    console.log(`server on https://192.168.0.100`)
})


// let server = app.listen(process.env.PORT || 443, function () {
//     let port = server.address().port;
//     console.log("My Line bot App running on port", port);
// });