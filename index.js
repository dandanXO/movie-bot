const linebot = require('linebot'),
    express = require('express'),
    https = require('https'),
    fs = require('fs');
const app = express();

const PATH_PRIVATE_KEY = './config/private.key';
const PATH_CERTIFICATE = './config/certificate.pem';
const PATH_CA_BUNDLE = './config/ca_bundle.pem'
const hskey = fs.readFileSync(PATH_PRIVATE_KEY);
const hscert = fs.readFileSync(PATH_CERTIFICATE);
const hsca = fs.readFileSync(PATH_CA_BUNDLE, 'utf8');

//routes
const lineBot = require('./bot/line/index');
const telegramBot = require('./bot/telegram/index')
app.use('/line',lineBot)
app.use('/telegram',telegramBot)
// 在 localhost 走 ssl 443 port
const server = https.createServer({
    ca: hsca,
    key: hskey,
    cert: hscert
}, app);
server.listen(process.env.PORT || 443, '192.168.0.100', () => {
    console.log(`server on https://192.168.0.100`)
});