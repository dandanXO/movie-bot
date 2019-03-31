const linebot = require('linebot'),
    express = require('express');

const lineSecret = require('./config/linceSecret.json');
const util = require('util');
const https = require('https');
const fs = require('fs');
var caPath = './config/ca_bundle.pem'
var keyPath = './config/private.key';
var certPath = './config/certificate.pem';
var caPath = './config/ca_bundle.pem'
var hskey = fs.readFileSync(keyPath,'utf8');
var hscert = fs.readFileSync(certPath,'utf8');
var hsca = fs.readFileSync(caPath,'utf8')

let bot = linebot({
    channelId: lineSecret.channelId,
    channelSecret: lineSecret.channelSecret,
    channelAccessToken: lineSecret.channelAccessToken
});


const linebotParser = bot.parser();
const app = express();

bot.on('message', function (event) {
    // 把收到訊息的 event 印出來
    console.log(event);
    event.reply(`你剛剛說的是: ${event.message.text}  ，另外我覺得莊王是智障`)
        .then(function (data) {
            // 當訊息成功回傳後的處理
        }).catch(function (error) {
            // 當訊息回傳失敗後的處理
        });
});



app.get('/test', (req, res) => {
    res.send('ssl test')
})


app.post('/webhook', linebotParser);


// let server = app.listen(process.env.PORT || 8080, function () {
//     let port = server.address().port;
//     console.log("My Line bot App running on port", port);
// });





//在 localhost 走 ssl 443 port

const server = https.createServer({
    ca:hsca,    
    key: hskey,
    cert: hscert
}, app)

server.listen(process.env.PORT || 443, '192.168.0.100', () => {
    console.log(`server on https://192.168.0.100`)
})