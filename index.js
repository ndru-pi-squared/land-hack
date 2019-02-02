// required packages
const request = require('request');
const readline = require('readline');

// URL of api
//var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public LIMIT 10";
var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public";
const limit = 10; // limits the data response. without an response, the query will take a long time to return data

var log = console.log;

// create interface to get user input and display output
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// get user input
var recursiveAsyncReadLine = function () {
  rl.question('Enter last name and first name: ', function (input) {
    
    // close reader if user enters exit
    if (input == 'exit'){
      return rl.close(); //closing RL and returning from function.
    }
    // otherwise, make request
    getProperties(input);

    // log
    //log('Entered name was: "', input, '"');
    // recursiveAsyncReadLine(); // Calling this function again to ask new question
  });
};

recursiveAsyncReadLine(); //we have to actually start our recursion somehow


var getProperties = function (name) {

  // convert name to uppercase and add to query
  var query = `${url} WHERE owner_1 LIKE '${name.toUpperCase()}%' LIMIT ${limit}`; // %25 is % .... SQL LIKE operator
  log(query);
  /*request(url, function (error, response, body) {
    
    log('error:', error); // Print the error if one occurred
    log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //log('body:', body); // Print the HTML for the Google homepage.

    // parse json data
    var data = JSON.parse(body);
    log(data);
  });*/
  recursiveAsyncReadLine(); // Calling this function again to ask new question
}
