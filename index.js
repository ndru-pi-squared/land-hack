const request = require('request');

var url = "https://phl.carto.com/api/v2/sql?q=SELECT owner_1, sale_date,sale_price,year_built FROM opa_properties_public LIMIT 10";

request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});