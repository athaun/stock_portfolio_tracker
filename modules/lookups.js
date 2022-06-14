const express = require('express');
const axios = require('axios');
const utils = require('./utils.js');
const Asset = require('./models/Asset')
const List = require('./models/List');

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

    // Find what lists this symbol is in and pass them to the document
    let lists = await List.find({})
    let inLists = [], inWatchlist = false, inPortfolio = false
    for (let i in lists) {
        let { assets: assetIds } = lists[i]
        let assets = await Asset.find({ _id: { $in: assetIds } })

        if (assets.some(e => e.ticker == ticker)) {
            inLists.push(lists[i].name)
        }
    }

    if (inLists.some(e => e == "watchlist")) inWatchlist = true
    if (inLists.some(e => e == "portfolio")) inPortfolio = true

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

    res.render('ticker_lookup', { ticker, quote, profile, news, history, inWatchlist, inPortfolio });    
})

// router.get('/:name', async (req, res) => {
//     // res.render('ticker_lookup', { quote, profile, news, history });    
// })

module.exports = router