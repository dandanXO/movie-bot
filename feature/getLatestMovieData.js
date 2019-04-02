const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports.getLatestMovieData = async function () {
    let res = await superagent.get('http://www.atmovies.com.tw/movie/');
    let $ = await cheerio.load(res.text)
    let latestMovie = await $('select[name=select2] option').filter((index, obj) => {
        return $(obj).text()
    })
    const data = []
    async function processArray(latestMovie) {
        for (const item of Object.keys(latestMovie)) {
            
            if(latestMovie[item].attribs != undefined){
                    let res = await superagent.get(`http://www.atmovies.com.tw${latestMovie[item].attribs.value.trim()}`)
                    let $ = await cheerio.load(res.text)
                    let youtubeUrl = await $('.video_view iframe').attr('src')
                    // await console.log(latestMovie[item].children[0].data.trim())
                    // await console.log(`http://www.atmovies.com.tw${latestMovie[item].attribs.value.trim()}`)
                    // await console.log(youtubeUrl)
                    await data.push({
                        name: latestMovie[item].children[0].data.trim(),
                        introductionUrl: `http://www.atmovies.com.tw${latestMovie[item].attribs.value.trim()}`,
                        youtubeUrl: youtubeUrl
                    })
                }
        }

        data.shift();

        return data
    }
    return processArray(latestMovie)
}



