const linebot = require('linebot'),
    express = require('express');

const lineSecret = require('./config/linceSecret.json');
const util = require('util');
const https = require('https');
const fs = require('fs');
var keyPath = './config/private.key';
var certPath = './config/certificate.pem';
var caPath = './config/ca_bundle.pem'
var hskey = fs.readFileSync(keyPath);
var hscert = fs.readFileSync(certPath);
var hsca = fs.readFileSync(caPath, 'utf8')

let bot = linebot({
    channelId: lineSecret.channelId,
    channelSecret: lineSecret.channelSecret,
    channelAccessToken: lineSecret.channelAccessToken
});
const linebotParser = bot.parser();
const app = express();

const getLatestMovie = require('./feature/getLatestMovieData')


bot.on('message', function (event) {
    const askLatestMovie = event.message.text.match(/最新電影/);
    if (askLatestMovie) {
        getLatestMovie.getLatestMovieData()
            .then((data) => {
                let replys = []
                const dataLength = data.length
                const forloop = (Number.parseInt(data.length / 15))<=0 ? 1:(Number.parseInt(data.length / 15));
                if(forloop>4){
                    forloop=4
                }
                for (let k = 0; k < forloop; k++) {
                    let reply = ''
                    for (let i = k*15; i < 15*(k+1); i++) {
                        reply = reply + `
電影名稱: ${data[i].name}
電影詳細介紹: ${data[i].introductionUrl}
電影預告片: ${data[i].youtubeUrl}
`
                    }
                    replys.push(reply)
                }
                replys.push('最新的在最上面，資料有點多請見諒囉')
                event.reply(replys).catch(e => { console.log(e) })
            }).catch(e => { console.log(e) })
    }

});

app.post('/webhook', linebotParser);

// 在 localhost 走 ssl 443 port

const server = https.createServer({
    ca: hsca,
    key: hskey,
    cert: hscert
}, app)
server.listen(process.env.PORT || 443, '192.168.0.100', () => {
    console.log(`server on https://192.168.0.100`)
})


