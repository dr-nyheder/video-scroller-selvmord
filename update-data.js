const request = require('request')
const fs = require('fs');

const sheets = 1;
const path = './src/assets/data/';

function reformatData(entries) {
    const data = [];
    const cols = getCols(entries);
    entries.forEach((entry) => {
        const obj = {};
        cols.forEach((col) => {
            obj[col.replace('gsx$','')] = entry[col]['$t']
        });
        data.push(obj);
    })
    return JSON.stringify(data);
}

function getCols(entries) {
    const cols = [];
    // console.log(entries);
    Object.keys(entries[0]).forEach(function (key) {
        if (key.startsWith('gsx$')) {
            cols.push(key)
        }
    });
    return cols;

}

function getUrl(id) {
    // '1ct4p64KJ2DdLjgP9ElZvzUSDN7meezxMl0FmRns9PpY'
    return `https://spreadsheets.google.com/feeds/list/110xv_Q_U73BRRirRgzLGBZ_DSUg1h-by0xLDWiG5flc/${id}/public/values?alt=json`; // Mord
    // return `https://spreadsheets.google.com/feeds/list/1ct4p64KJ2DdLjgP9ElZvzUSDN7meezxMl0FmRns9PpY/${id}/public/values?alt=json`; // Merkel
    // return `https://spreadsheets.google.com/feeds/list/1cbOAaynPjMFanNGc3du-SnztRXqewE7QZksFdReLQew/${id}/public/values?alt=json`;
}

function buildFilename(feed) {
    return feed.title['$t'].replace(/[^a-z0-9]/gi, '').toLowerCase() + '.json';
}

function writeFile(name, data) {
    fs.writeFile(path + name, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("Generated: " + name);
    });
}

function buildJsonFile(id) {
    const url = getUrl(id);
    request(url, (error, response, body)=> {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body)
        // console.log(data);
        const formattedJson = reformatData(data.feed.entry);
        const filename = buildFilename(data.feed)

        writeFile(filename, formattedJson)
      } else {
        console.log("Got an error: ", error, ", status code: ", response.statusCode, ", url: ", url)
      }
    })
}


for(n=1; n<=sheets; n++) {
    buildJsonFile(n)
}


