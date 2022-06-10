const express = require('express')
const index = require('../index')

let router = express.Router()

/*
LISTS (GET requests) - portfolio, watchlist, etc
GET     /lists/:list/stocks - Return a full list of stocks
GET     /lists/:list/cryptos - Return a full list of cryptos
GET     /lists/:list   - Return a full list of stocks/cryptos
*/
router.get('/:list/stocks', (req, res) => {

})

router.get('/:list/cryptos', (req, res) => {
    
})

router.get('/:list', (req, res) => {
    
})

/* 
LISTS (modification requests)
POST    /lists/:list   - Add a ticker or crypto to a list
PATCH   /lists/:list   - Edit a ticker or crypto in a list
DELETE  /lists/:list   - Remove a ticker or crypto from a list
*/
router.post('/:list', (req, res) => {
    let { list } = req.params
    if (list == "watchlist") {
        res.send({res: `Added ${req.body.ticker} to your watchlist.`})
    }    
})

router.patch('/:list', (req, res) => {
    
})

router.delete('/:list', (req, res) => {
    
})

module.exports = router