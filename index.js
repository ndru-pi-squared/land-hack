const request = require('request');
const readline = require('readline');

var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public LIMIT 10";

var log = console.log;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var recursiveAsyncReadLine = function () {
  rl.question('Enter first name and last name: ', function (answer) {
    
    // close reader if user enters exit
    if (answer == 'exit') //we need some base case, for recursion
      return rl.close(); //closing RL and returning from function.

    // otherwise, make request
    // request code here .....

    // log
    log('Entered name was: "', answer, '"');
    recursiveAsyncReadLine(); //Calling this function again to ask new question
  });
};

recursiveAsyncReadLine(); //we have to actually start our recursion somehow


/*request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});*/
