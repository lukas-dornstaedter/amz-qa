const config = require("./config");
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { resolve } = require("path");

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'uniproject';
const collectionName = 'qaDE'


// Produkt Link
const qaLink = config.QA_PRODUCT_LINK;
const qaParameter = config.QA_PRODUCT_PARAMETER;

// Start Getting Q&As for a product

(async () => {
    //getting the number of qa pages
    //let numberOfPages = await getNumberOfPages(qaLink,qaParameter);
    let numberOfPages = 77;
    console.log(numberOfPages);

    //request each page and save the data to mongo
    
    for(let i=47; i<numberOfPages; i++){
        let qaData = await getQAData(qaLink, i+1, qaParameter);
        pushQAToDB(qaData);
    }
    

    //let qaData = await getQAData (qaLink, 1, qaParameter);
    //console.log(qaData);
})()



/*
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
*/

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

function getNumberOfPages(qaLink, qaParameter){
    return new Promise((resolve, reject) => {
        
        request({
            'url':`${qaLink}1${qaParameter}`,
            'method': "GET",
            'host':'188.170.233.109',
            'port': 3128,
          }, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                let numberOfPages = $('.askPaginationHeader').find('.askPaginationHeaderMessage').text().trim()
                numberOfPages = numberOfPages.slice(numberOfPages.indexOf("von ")+4, numberOfPages.indexOf('Fragen')-1);
                let requestCount = Math.round(Number(numberOfPages) / 10);
                if(numberOfPages%10 != 0){
                    requestCount++;
                }

                setTimeout(function(){ 
                    resolve(requestCount);
                }, 2000);

                
        
            } else {
                console.log(response.statusCode);
                reject(error);
        
            }
    })

    })
}

function getQAData(qaLink, qaPage, qaParameter){
    return new Promise ((resolve, reject) => {
        let qaData = [];
        request({
            'url':`${qaLink}${qaPage}${qaParameter}`,
            'method': "GET",
            'host':'176.9.75.42',
            'port': 8080,
          },(error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                $('.a-spacing-base ').each((i, el) => {
                    const review = {
                        productQuestion: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find(".a-spacing-small").find("a").find(".a-declarative").text().trim(),
                        productAnswer: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find('.a-spacing-base').find('.a-col-right').children('span').text(),
                        productAnswerLong: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find('.a-spacing-base').find('.a-col-right').find('.askLongText').not('a').text().trim()
                            }
            
                    console.log(review);
                    if(review.productQuestion!=null && review.productQuestion != ""){
                    if(review.productAnswerLong == ''){
                        qaData.push({
                            productQuestion: review.productQuestion,
                            productAnswer: review.productAnswer.replace(/\n/g,'')
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
                setTimeout(function(){ 
                    resolve(qaData);
                }, 2000);
        
            } else {
                console.log(response.statusCode);
                reject(error);
        
            }
        })
    })
}