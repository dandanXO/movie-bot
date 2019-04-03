const superagent = require('superagent');
const cheerio = require('cheerio');

const cituData = {
    "基隆": "a01",
    "台北": "a02",
    "桃園": "a03",
    "新竹": "a35",
    "苗栗": "a37",
    "台中": "a04",
    "彰化": "a47",
    "雲林": "a45",
    "南投": "a49",
    "嘉義": "a05",
    "台南": "a06",
    "高雄": "a07",
    "宜蘭": "a39",
    "花蓮": "a38",
    "台東": "a89",
    "屏東": "a87",
    "澎湖": "a69",
    "金門": "a68"
}



module.exports.getMovieLocalTherterAndTime = async function (movieName, local) {
    let res = await superagent.get('http://www.atmovies.com.tw/movie/');
    let $ = await cheerio.load(res.text)
    let re = await new RegExp(movieName, "i");
    let filmId = await $('select[name=film_id] option').filter((index, obj) => {
        return re.test($(obj).text())
    }).val()
    try {
        res = await superagent.get(`http://www.atmovies.com.tw/showtime/${filmId}/${cituData[local]}/`);
    } catch (e) {
        console.log(e)
        return [{ message: 'wrong city OR wrong movie name' }]
    }
    $ = await cheerio.load(res.text);
    let d = new Date()
    let hour = d.getHours()
    let minute = d.getMinutes()
    let times =
        $('#filmShowtimeBlock li')
            .filter((index, obj) => {
                var time = $(obj).text().split('：')
                return (time[0] * 60 + time[1] * 1 > hour * 60 + minute * 1) && (time[0] * 60 + time[1] * 1 < (hour + 3) * 60 + minute * 1)
            })
            .map((index, obj) => {
                return {
                    time: $(obj).text(),
                    theater: $(obj).closest('ul').find('.theaterTitle').text()
                }
            })
            .get()
            .sort((a, b) => {
                var a = a.time.split('：')
                var b = b.time.split('：')
                return (a[0] * 60 + a[1] * 1 > b[0] * 60 + b[1] * 1) ? 1 : -1
            })
    return times
}
    // getMovieLocalTherterAndTime("小飛d象","新竹")
    // .then(data=>{
    //     if(data.length<=0){
    //         console.log('no data')
    //     }else{
    //         console.log(data)
    //     }

    // })