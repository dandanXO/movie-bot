const linebot = require('linebot'),
    express = require('express'),
    util = require('util'),
    https = require('https'),
    fs = require('fs');

const lineSecret = require('./config/linceSecret.json');

const PATH_PRIVATE_KEY = './config/private.key';
const PATH_CERTIFICATE = './config/certificate.pem';
const PATH_CA_BUNDLE = './config/ca_bundle.pem'
const hskey = fs.readFileSync(PATH_PRIVATE_KEY);
const hscert = fs.readFileSync(PATH_CERTIFICATE);
const hsca = fs.readFileSync(PATH_CA_BUNDLE, 'utf8');

let bot = linebot({
    channelId: lineSecret.channelId,
    channelSecret: lineSecret.channelSecret,
    channelAccessToken: lineSecret.channelAccessToken
});
const linebotParser = bot.parser();
const app = express();

//Import function
const getLatestMovie = require('./feature/getLatestMovieData');
const getMovieLocalTherterAndTime = require('./feature/getMovieLocalTherterAndTime');

bot.on('message', function (event) {

    console.log(event)
<<<<<<< HEAD
    if(event.message.type=='text'){
    const askLatestMovie = event.message.text.match(/最新電影/);
    const movielocal = event.message.text.match(/場次|地點/)
=======
    if (event.message.type == 'text') {
        const askLatestMovie = event.message.text.match(/最新電影/);
        const movielocal = event.message.text.match(/場次|地點/);
>>>>>>> FrankLin3501-dev
        if (movielocal) {
            const messages = event.message.text.split(' ');
            getMovieLocalTherterAndTime.getMovieLocalTherterAndTime(messages[1], messages[2])
                .then(data => {
                    let replays = [`久等了~ 使用方式 E.g: 場次 {電影名稱} {縣市名稱}`]
                    let replay = ''
                    let forloop = (Number.parseInt(data.length / 40)) <= 0 ? 1 : (Number.parseInt(data.length / 40));
                    if (data[0].time != undefined) {
                        if (data.length > 40) {
                            if (forloop > 4) {
                                forloop = 4
                            }
                            for (let k = 0; k < forloop; k++) {
                                replay = ''
                                for (let i = k * 40; i < 40 * (k + 1); i++) {
                                    replay = replay + `時間: ${data[i].time} ,地點:${data[i].theater}\n`
                                }
                            }
                            event.reply(replays)
                                .then(() => { })
                                .catch((e) => {
                                    console.log(e)
                                })
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                replay = replay + `時間: ${data[i].time} ,地點:${data[i].theater}\n`
                            }
                            replays.push(replay)
                            event.reply(replays)
                                .then(() => { })
                                .catch((e) => { console.log(e) })
                        }
                    } else {
                        replays.push('QQ 沒東西')
                        event.reply(replays)
                            .then(() => { })
                            .catch((e) => {
                                console.log(e)
                            });
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (askLatestMovie) {
            getLatestMovie.getLatestMovieData()
                .then((data) => {
                    let replys = []
                    let forloop = (Number.parseInt(data.length / 10)) <= 0 ? 1 : (Number.parseInt(data.length / 10));
                    console.log(data)
                    if (forloop > 4) {
                        forloop = 4
                    }
                    for (let k = 0; k < forloop; k++) {
                        let reply = ''
<<<<<<< HEAD
                        for (let i = k * 10; i < 10 * (k + 1); i++) {
                            reply = reply + `
    電影名稱: ${data[i].name}
    電影詳細介紹: ${data[i].introductionUrl}
    電影預告片: ${data[i].youtubeUrl}
    `
=======
                        for (let i = k * 15; i < 15 * (k + 1); i++) {
                            reply = reply +
                                `電影名稱: ${data[i].name}\n` +
                                `電影詳細介紹: ${data[i].introductionUrl}\n` +
                                `電影預告片: ${data[i].youtubeUrl}\n`;
>>>>>>> FrankLin3501-dev
                        }
                        replys.push(reply);
                    }
                    replys.push('最新的在最上面，資料有點多請見諒囉')
                    event.reply(replys).catch(e => {
                        console.log(e)
                    });
                }).catch(e => {
                    console.log(e)
                })
        }
    }
});

app.post('/webhook', linebotParser);

// 在 localhost 走 ssl 443 port

const server = https.createServer({
    ca: hsca,
    key: hskey,
    cert: hscert
}, app);
server.listen(process.env.PORT || 443, '192.168.0.100', () => {
    console.log(`server on https://192.168.0.100`)
});