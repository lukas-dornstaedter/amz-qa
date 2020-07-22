const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");


// Produkt Link
const qaLink = 'https://www.amazon.de/ask/questions/asin/B0756CYWWD/';
const qaPage = 1;
const qaParameter = '/ref=ask_dp_iaw_ql_hza?isAnswered=true#question-Tx2B0DAZRJ1HTV8';


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

fs.readFile("html.txt", (err, data) => {
    let $ = cheerio.load(JSON.parse(data));
        $('.a-spacing-base ').each((i, el) => {
        const review = {
            productQuestion: $(el).find('.a-fixed-left-grid-inner').find('.a-col-right').find(".a-spacing-small").find("a").find(".a-declarative").text().trim()
                }

        if(review.productQuestion!=null && review.productQuestion != ""){
        console.log(review);
    }

        
    })
})


//            productQuestion: $(el).find('.a-fixed-left-grid-col .a-col-right').children().children().html()