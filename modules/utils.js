const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "cah450qad3i90t1a44a0"
// api_key.apiKey = "sandbox_cah450qad3i90t1a44ag"
// AlphaV: L9WXYEWKSS6Q2DIR
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

module.exports = {
    getDate,
    finnhubClient
}