const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/stocks')
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log(error)
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

/* HOME PAGE */
app.get('/', (req, res) => {
    res.render('home')
})

app.use("/stocks", require("./modules/lookups"))
app.use("/cryptos", require("./modules/lookups"))

app.use("/lists", require("./modules/lists"))

app.all("*", (req, res) => {
    res.render("error", { error: `The page you are looking for doesn't exist.` })
})

app.listen(8090, () => {
    console.log("Listening")
})

/* 
* Lookups *
GET     /stocks/:ticker - returns ticker lookup page
GET     /cryptos/:name  - returns crypto lookup page

* Lists - portfolio, watchlist, etc *
GET     /lists/:list/stocks - Return a full list of stocks
GET     /lists/:list/cryptos - Return a full list of cryptos
GET     /lists/:list   - Return a full list of stocks/cryptos

POST    /lists/:list   - Add a ticker or crypto to a list
PATCH   /lists/:list   - Edit a ticker or crypto in a list
DELETE  /lists/:list   - Remove a ticker or crypto from a list
*/

module.exports = app