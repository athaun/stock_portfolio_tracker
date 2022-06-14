const express = require('express')
const index = require('../index')
const List = require('./models/List')
const Asset = require('./models/Asset')
const utils = require('./utils')

let router = express.Router()

/*
LISTS (GET requests) - portfolio, watchlist, etc
GET     /lists/:list/stocks - Return a full list of stocks
GET     /lists/:list/cryptos - Return a full list of cryptos
GET     /lists/:list/add - Return a page with a form for adding stocks into portfolio
GET     /lists/:list - Return a full list of stocks/cryptos
*/
router.get('/:list/stocks', (req, res) => {
    res.render("error", { error: `Route not yet implemented.` })
})

router.get('/:list/cryptos', (req, res) => {
    res.render("error", { error: `Route not yet implemented.` })
})

router.get('/:list/add/:ticker', (req, res) => {
    res.render("add_asset", { list: req.params.list, ticker: req.params.ticker })
})

router.get('/:list', async (req, res) => {
    let listName = req.params.list
    const listCount = await List.count({ name: listName }) // Count of lists matching the request (should be <= 1)
    if (listCount == 0) {
        res.render("error", { error: `Could not find ${listName}.` })
        return
    }

    let { listType, assets: assetIds } = await List.findOne({ name: listName })
    let assets = await Asset.find({ _id: { $in: assetIds } })
    let quotes = []
    let requests = []
    for (let i in assets) {
        requests.push(new Promise((resolve, reject) => {
            utils.finnhubClient.quote(assets[i].ticker, (error, data, response) => {
                quotes[i] = data
                resolve()
            })
        }))
    }
    
    await Promise.all(requests)

    if (quotes.length == assets.length) {
        res.render("list_viewer", { listType, listName, assets, quotes })
    } else {
        res.render("error", { error: `An error was encountered while loading ${list}.` })
    }
})

/* 
LISTS (modification requests)
POST    /lists/:list   - Add a ticker or crypto to a list
PATCH   /lists/:list   - Edit a ticker or crypto in a list
DELETE  /lists/:list   - Remove a ticker or crypto from a list
*/
router.post('/:list', async (req, res) => {
    try {

        let newAsset, listType
        if (req.body.buyPrice && req.body.quantity) {
            // If the request contains purchase data, save that in the Asset and make the list of type "portfolio" (not the same as the name of the list)
            listType = "portfolio"
            newAsset = new Asset({
                ticker: req.body.ticker,
                type: "stock",
                buyPrice: parseFloat(req.body.buyPrice),
                quantity: parseFloat(req.body.quantity)
            })
        } else {
            listType = "watch"
            newAsset = new Asset({
                ticker: req.body.ticker,
                type: "stock"
            })
        }
        newAsset.save()
        
        const listCount = await List.count({ name: req.params.list}) // Count of lists matching the request (should be <= 1)
        if (listCount == 0) {
            // Create a new list if no list with this name exists
            let newList = new List({ name: req.params.list, listType: listType  })
            newList.assets.push(newAsset._id)            
            newList.save()

            res.send({res: `Created list "${req.params.list}" and added ${req.body.ticker} to it.`})
        } else {
            
            // Load all of the assets contained in the list
            let { assets: assetIds } = await List.findOne({ name: req.params.list })
            let assets = await Asset.find({ _id: { $in: assetIds } })

            // Check if this ticker is already in the list
            if (assets.some(e => e.ticker == req.body.ticker)) {
                res.send({res: `${req.body.ticker} is already in ${req.params.list}.`})
                return
            }

            // If the ticker isn't in the list, push it to the assets array
            await List.updateOne({ name: req.params.list }, {
                $push: { assets: newAsset._id }
            })       

            res.send({res: `Added ${req.body.ticker} to ${req.params.list}.`})    
        }
    } catch (error) {
        console.log(error)
        res.send({res: `Could not add ${req.body.ticker} to ${req.params.list}.`})
    }   
})

router.patch('/:list', (req, res) => {
    res.send(`Route not yet implemented.`)
})

router.delete('/:list', async (req, res) => {
    let { assets: assetIds } = await List.findOne({ name: req.params.list })
    let assets = await Asset.find({ _id: { $in: assetIds } })
    for (let i in assets) {
        if (assets[i].ticker == req.body.ticker) {
            await Asset.findByIdAndDelete(assets[i]._id)
            res.send(`Deleted asset: ${assets[i]}`)
            return
        }
    }
})

module.exports = router