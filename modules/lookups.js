const express = require('express');
const axios = require('axios');
const utils = require('./utils.js')

let router = express.Router()

/* 
LOOKUPS 
GET     /stocks/:ticker - returns ticker lookup page
GET     /cryptos/:name  - returns crypto lookup page
*/

router.get('/:ticker', async (req, res) => {
    let { ticker } = req.params
    let quote, profile, news, history
    ticker = ticker.toUpperCase()
    
    let requests = []
    
    requests.push(new Promise((resolve, reject) => {
        utils.finnhubClient.companyProfile2({'symbol': ticker}, (error, data, response) => {
            profile = data
            resolve()
        })
    }))
    
    requests.push(new Promise((resolve, reject) => {
        utils.finnhubClient.quote(ticker, (error, data, response) => {
            quote = data
            resolve()
        })
    }))
    
    requests.push(new Promise((resolve, reject) => {
        utils.finnhubClient.companyNews(ticker, utils.getDate(-1), utils.getDate(0), (error, data, response) => {
            news = data
            resolve()
        });
    }))

    // requests.push(new Promise((resolve, reject) => {
    //     axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&datatype=csv&apikey=L9WXYEWKSS6Q2DIR`)
    //     .then(res => {
    //         history = res.data;
    //         resolve()
    //     }).catch(error => {
    //         console.error(error);
    //         resolve()
    //     });
    // }))
    
    await Promise.all(requests)

    res.render('ticker_lookup', { ticker, quote, profile, news, history });    
})

router.get('/:name', async (req, res) => {
    // res.render('ticker_lookup', { quote, profile, news, history });    
})

module.exports = router