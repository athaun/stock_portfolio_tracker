const express = require('express');
const finnhub = require('finnhub');
const app = express();
const path = require('path');
const axios = require('axios');
const utils = require('./utils.js')

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = "sandbox_cah450qad3i90t1a44ag"
api_key.apiKey = "cah450qad3i90t1a44a0"
const finnhubClient = new finnhub.DefaultApi()

// AlphaV: L9WXYEWKSS6Q2DIR

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/add/:list', (req, res) => {
    let { list } = req.params
    if (list == "watchlist") {
        res.send({res: `Added ${req.body.ticker} to your watchlist.`})
    }    
})

app.get('/stocks/:ticker', async (req, res) => {
    let { ticker } = req.params
    let quote, profile, news, history
    ticker = ticker.toUpperCase()
    
    let requests = []
    
    requests.push(new Promise((resolve, reject) => {
        finnhubClient.companyProfile2({'symbol': ticker}, (error, data, response) => {
            profile = data
            resolve()
        })
    }))
    
    // TODO: remove this in favor of a proper search system to find cryptos and tickers by company names
    // if (!profile.name) {
    //     res.render('ticker_notfound', { ticker });
    //     return    
    // }
    
    requests.push(new Promise((resolve, reject) => {
        finnhubClient.quote(ticker, (error, data, response) => {
            quote = data
            resolve()
        })
    }))
    
    requests.push(new Promise((resolve, reject) => {
        finnhubClient.companyNews(ticker, utils.getDate(-1), utils.getDate(0), (error, data, response) => {
            news = data
            resolve()
        });
    }))

    requests.push(new Promise((resolve, reject) => {
        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&datatype=csv&apikey=L9WXYEWKSS6Q2DIR`)
        .then(res => {
            history = res.data;
            resolve()
        }).catch(error => {
            console.error(error);
            resolve()
        });
    }))
    
    await Promise.all(requests)

    // console.log(history)

    res.render('ticker_lookup', { quote, profile, news, history });    
})

app.get('/cryptos/:name', async (req, res) => {
    // res.render('ticker_lookup', { quote, profile, news, history });    
})

app.listen(8090, () => {
    console.log("Listening on 8090")
})