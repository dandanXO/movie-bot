const express = require('express');
const router = express.Router();

const TelegramBot = require('node-telegram-bot-api');

// api token
const token = '807292662:AAENotmD5rIAQ76wySZEuz-owacLEic6OlY';

const bot = new TelegramBot(token, { polling: true });

//Import function
const getLatestMovie = require('../../feature/getLatestMovieData');
const getMovieLocalTherterAndTime = require('../../feature/getMovieLocalTherterAndTime');

bot.onText(/最新電影/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    getLatestMovie.getLatestMovieData()
        .then((data) => {
            let reply = ''
            let forloop = (Number.parseInt(data.length / 15)) <= 0 ? 1 : (Number.parseInt(data.length / 15));
            for (let k = 0; k < forloop; k++) {
                let reply = ''
                for (let i = k * 15; i < 15 * (k + 1); i++) {
                    reply = reply +
                        `電影名稱: ${data[i].name}\n` +
                        `電影詳細介紹: ${data[i].introductionUrl}\n` +
                        `電影預告片: ${data[i].youtubeUrl}\n`;
                }
                bot.sendMessage(chatId,reply);
            }
        })
});

bot.onText(/(場次|地點) (.+) (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    getMovieLocalTherterAndTime.getMovieLocalTherterAndTime(match[2], match[3])
    .then(data => {
        bot.sendMessage(chatId,'久等了~ 使用方式 E.g: 場次 {電影名稱} {縣市名稱}')
        let replay = ''
        for (let i = 0; i < data.length; i++) {
            replay = replay + `時間: ${data[i].time} ,地點:${data[i].theater}\n`
        }
        bot.sendMessage(chatId,  replay)
    })
        
});

// bot.on('message',event=>{
//     console.log(event)
//     bot.sendMessage(event.from.id,`You Send: ${event.text}`)
// })
module.exports = router;