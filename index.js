const express = require('express');
const finnhub = require('finnhub');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = "sandbox_cah450qad3i90t1a44ag"
api_key.apiKey = "cah450qad3i90t1a44a0"
const finnhubClient = new finnhub.DefaultApi()

function getDate (addDays) {
    const date = new Date();
    date.setDate(date.getDate() + addDays);

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();

    month = String(month).padStart(2, '0')
    day = String(day).padStart(2, '0')

    const str = `${year}-${month}-${day}`;

    return str
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/stocks/:ticker', async (req, res) => {
    let { ticker } = req.params
    let quote, profile, news
    ticker = ticker.toUpperCase()

    await new Promise((resolve, reject) => {
        finnhubClient.companyProfile2({'symbol': ticker}, (error, data, response) => {
            profile = data
            resolve()
        })
    })
    
    if (!profile.name) {
        res.render('ticker_notfound', { ticker });
        return    
    }
    
    await new Promise((resolve, reject) => {
        finnhubClient.quote(ticker, (error, data, response) => {
            quote = data
            resolve()
        })
    })  
    
    await new Promise((resolve, reject) => {
        finnhubClient.companyNews(ticker, getDate(-1), getDate(0), (error, data, response) => {
            news = data
            resolve()
        });
    })   

    res.render('ticker_lookup', { quote, profile, news });    
})

app.listen(8090, () => {
    console.log("Listening on 8080")
})