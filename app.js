const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'uniproject';
const collectionName = 'qaDE'


// Produkt Link
const qaLink = 'https://www.amazon.de/ask/questions/asin/B0756CYWWD/';
const qaPage = 1;
const qaParameter = '/ref=ask_dp_iaw_ql_hza?isAnswered=true#question-Tx2B0DAZRJ1HTV8';


// Get the Number of Pages
fs.readFile("html.txt", (err, data) => {
    let $ = cheerio.load(JSON.parse(data));
    let numberOfPages = $('.askPaginationHeader').find('.askPaginationHeaderMessage').text().trim()
    numberOfPages = numberOfPages.slice(numberOfPages.indexOf("von ")+4, numberOfPages.indexOf('Fragen')-1);
    let requestCount = Math.round(Number(numberOfPages) / 10);
    if(numberOfPages%10 != 0){
        requestCount++;
    }
    console.log(requestCount);
})


// Get Amz Product HTML Code for testing
/*
request(`${qaLink}${qaPage}${qaParameter}`, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        fs.writeFile("html.txt", JSON.stringify(html), ()=> {
            console.log("done");
        })

    } else {
        console.log(`Err on page ${page}`);

    }
})
*/

// work with the html test code 
/*
let qaData = [];

fs.readFile("html.txt", (err, data) => {
    let $ = cheerio.load(JSON.parse(data));
        $('.a-spacing-base ').each((i, el) => {
        const review = {
            productQuestion: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find(".a-spacing-small").find("a").find(".a-declarative").text().trim(),
            productAnswer: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find('.a-spacing-base').find('.a-col-right').children('span').text(),
            productAnswerLong: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find('.a-spacing-base').find('.a-col-right').find('.askLongText').not('a').text().trim()
                }

        if(review.productQuestion!=null && review.productQuestion != ""){
        if(review.productAnswerLong == ''){
            qaData.push({
                productQuestion: review.productQuestion,
                productAnswer: review.productAnswer
            })
        } else {
            qaData.push({
                productQuestion: review.productQuestion,
                productAnswer: review.productAnswerLong.replace('Weniger anzeigen', '').replace(/\n/g,'')
            })
        }


    }

        
    })
    console.log(qaData.length);
    pushQAToDB(qaData);
})
*/



function pushQAToDB(qaData){
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // Insert some documents
        collection.insertMany(qaData, function (err, result) {
            console.log(result);
        });
        client.close();
    });
}
