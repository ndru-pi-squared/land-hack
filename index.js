const request = require('request');
const readline = require('readline');

var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public LIMIT 10";

var log = console.log;


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var recursiveAsyncReadLine = function () {
  rl.question('Enter first name : ', (firstName) => {
    rl.question('Enter last name : ', (lastName) => {
      
      if (firstName == 'exit' || lastName == 'exit')
        return r1.close();
      
      if (firstName == '' || lastName == ''){
        log("No name was entered.");
        return r1.close();
      }

      log("The name you entered was: ", firstName, lastName);
      
      recursiveAsyncReadLine();
    });
});

};

recursiveAsyncReadLine(); //we have to actually start our recursion somehow

/*
request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/


