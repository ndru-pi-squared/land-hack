// required packages
const request = require('request');
const readline = require('readline');

// URL of api
//var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public LIMIT 10";
var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public";
const limit = 10; // limits the data response. without an response, the query will take a long time to return data

//https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public WHERE owner_1 LIKE 'JENKINS%25' LIMIT 10
var log = console.log;


// create interface to get user input and display output
var readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// get user input
var recursiveAsyncReadLine = function () {
  readLine.question('Enter first name : ', (firstName) => {
    if (firstName == 'exit'){
        return readLine.close();}
    if (firstName == '') {
      log("No name was entered.");
      return recursiveAsyncReadLine();
    }
    readLine.question('Enter last name : ', (lastName) => {

      if (lastName == 'exit')
        return readLine.close();

      if (lastName == '') {
        log("No name was entered.");
        return recursiveAsyncReadLine();
      }
      // otherwise, make request
      log("The name you entered was: ", firstName, lastName);

      getProperties(lastName.toUpperCase() + ' ' + firstName.toUpperCase());
      recursiveAsyncReadLine();
    });
  });
}

recursiveAsyncReadLine(); //we have to actually start our recursion somehow


var getProperties = function (name) {

  // convert name to uppercase and add to query
  
  var query = `${url} WHERE owner_1 LIKE '${name}%25' LIMIT 10`; // %25 is % .... SQL LIKE operator
  //log(query); //debugging


  // make the call
  request(query, function (error, response, body) {

    if (error) {
      log('error:', error); // Print the error if one occurred
      return
    }

    log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    // parse json data
    var data = JSON.parse(body);
    log(data);
    recursiveAsyncReadLine(); // Calling this function again to ask new question
  });

}