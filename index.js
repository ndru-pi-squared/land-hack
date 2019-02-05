// 888                             888 888    888                   888      
// 888                             888 888    888                   888      
// 888                             888 888    888                   888      
// 888       8888b.  88888b.   .d88888 8888888888  8888b.   .d8888b 888  888 
// 888          "88b 888 "88b d88" 888 888    888     "88b d88P"    888 .88P 
// 888      .d888888 888  888 888  888 888    888 .d888888 888      888888K  
// 888      888  888 888  888 Y88b 888 888    888 888  888 Y88b.    888 "88b 
// 88888888 "Y888888 888  888  "Y88888 888    888 "Y888888  "Y8888P 888  888 
                                                                          
                                                                          
// required packages
const request = require('request');
const readline = require('readline');

var preparedURL = "https://phl.carto.com/api/v2/sql?q="; // start to build the URL of api
var api_key = '126a657ce501575c55c35ee2c1156c5c00ae607'; // api key from geocod
var params = []; //array will store parameters to prep the URL with
const limit = 10; // limits the data response. without an response, the query will take a long time to return data

// color for console logging
var FgCyan = "\x1b[36m";
var Reset = "\x1b[0m";

// prints in color
var log = function(msg){
  console.log(FgCyan+'%s'+Reset, msg);
}


// create interface to get user input and display output
var readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// get user input
var recursiveAsyncReadLine = function () {
  readLine.question('\nEnter first name : ', (firstName) => {
    if (firstName == 'exit') {
      return readLine.close();
    }
    if (firstName == '') {
      log("No name was entered.");
      return recursiveAsyncReadLine();
    }
    if (firstName.indexOf(';') > -1) { //semicolon found, suspected malicious use, scrub/validate input in case api becomes insecure
      log("You have entered unfamilliar input. Please enter only characters and digits.");
      return recursiveAsyncReadLine();
    }

    readLine.question('Enter last name : ', (lastName) => {
      if (lastName == 'exit')
        return readLine.close();
      if (lastName == '') {
        return recursiveAsyncReadLine();
        log("No name was entered.");
      }
      if (lastName.indexOf(';') > -1) { //semicolon found, validate input
        return recursiveAsyncReadLine();
        log("You have entered unfamilliar input. Please enter only characters and digits.");
      }
      firstName = firstName.trim().toUpperCase();
      lastName = lastName.trim().toUpperCase();
      // otherwise, make request
      log("The name you entered was: " + firstName + " " + lastName);
      
      getProperties(lastName + ' ' + firstName).then(function(result){
        // show properties
        logProperties(result);
        // show coordinates for each property
        logCoordinates(result);
        recursiveAsyncReadLine();
        //log(result);
      },function(err){
        log(err);
        recursiveAsyncReadLine();
      });
      //recursiveAsyncReadLine();
    });
  });
}


var pushParams = function (params) {
  //input: takes the parameters we want and populates an array with them
  //output: void

  params.push("owner_1");
  params.push("sale_date");
  params.push("sale_price");
  params.push("year_built");
  params.push("location");
}


var prepareStatement = function (params) {
  //input: takes the query parameters array
  //output: returns the formatted SQL statement
  pushParams(params);
  var statement = "SELECT " + params + " FROM opa_properties_public";
  //log("testing statement" + statement);
  return statement;
}



/**
 * 
 * @param {*} name 
 * @returns property info and coordinates of all addresses under similar names
 * makes a request to the philadelphia api to get property data
 * and supplies the mailing address it retrieves to a geocoding api in order to get the coordinates
 */
var getProperties = function (name) {

  var coordinates = [];
  // add name to query
  var query = `${preparedURL} WHERE owner_1 LIKE '${name}%25' LIMIT 10`; // %25 is % .... SQL LIKE operator
  //log("testing query: " + query); //debugging
  return new Promise(function(resolve, reject){
    // make the call
    request(query, function (error, response, body) {
      if (error) {
        //log('error:', error); // Print the error if one occurred
        reject(error);
      }else{
        //log('statusCode:', response && response.statusCode); // Print the response status code if a response was received// parse json data
        var data = JSON.parse(body);
        resolve(data.rows)
      }
    });
  });
}

/**
 * 
 * @param {*} properties given by opendata api
 * prints information requested about property (params elements) such as owner_1, location, etc.
 * prints neatly
 */
var logProperties = function (properties) {
  //log(properties);
  log('\n');
  log('\t'+ properties.length + ' Properties Found')
  log('------------------------------------------------');
  for(var i = 0; i < properties.length; i++){
    // log(properties[i]);
    log("Owner: \t" + properties[i].owner_1);
    log("Location: \t" + properties[i].location); 
    log("  built: \t" +properties[i].year_built);   
    log("  sale price: \t" + properties[i].sale_price);
    log("  sale date: \t" + properties[i].sale_date + "\n");
  }
  log('------------------------------------------------'); 
}

/**
 * 
 * @param {*} properties given from opendata response
 * prints address and coordinates (lat,lng)
 */
var logCoordinates = function (properties) {
  var allAddressesToGeolocate = [];
  //log("\nGELOCATING IF DATA IS AVAILABLE");
  for (var i = 0; i <= properties.length - 1; i++) { //runtime O(n) + whatever getMap is
    allAddressesToGeolocate[i] = properties[i].location;
    //log("testing addresses to geolocate: " + allAddressesToGeolocate[i]);
    if (allAddressesToGeolocate[i] != "") { //prevent null requests  
      var c = allAddressesToGeolocate[i].charAt(0); //sample the first character 
      //log("testing c: " + c);
      if (c >= 0 && c <= 9) { //if the first character is a number, the address is in the proper format (improper format is 'PO box xyz')
        allAddressesToGeolocate[i] = allAddressesToGeolocate[i].replace(/\s*$/, ""); //get rid of whitespaces at the end of the entry
        allAddressesToGeolocate[i] = allAddressesToGeolocate[i] + " PHILADELPHIA PA"; //format address for geocoding

        getMap(allAddressesToGeolocate[i]).then(function (result) {
          log('\n')
          log(result[0].formatted_address);
          log('(' + result[0].location.lat +  ',' + result[0].location.lng + ')');
          //log('lat: ' + result[0].location.lat);
          //log('lng: ' + result[0].location.lng);
        }, function (err) {
          log(err);
        });
      }
    }
  }
}

/**
 * 
 * @param {*} addressToFormat a string address with spaces
 * @returns the same address, spaces replaced with '+'
 * helps format the URL for the geocoding api
 */
var formatGeocodingAddress = function (addressToFormat) {
  var formattedAddress = addressToFormat.split(' ').join('+');
  //log("testing formatted address: " + formattedAddress);
  return formattedAddress;
}

/**
 * 
 * @param {*} address an address supplied by the philadelphia api 
 * @returns coordinates for address IF available
 */
var getMap = function (address) {
  //if (address != "") { //if the attribute exists in the db for this entry
    //log("testing mailingAddress: " + mailingAddress);
    geocodeURL = "https://api.geocod.io/v1.3/geocode?q=" + formatGeocodingAddress(address) + "&api_key=" + api_key;//process.argv[2]; //126a657ce501575c55c35ee2c1156c5c00ae607"; //argv[1] if we want to use environment vars
    //log("testing geocodeURL: " + geocodeURL);
    return new Promise(function(resolve, reject){
      request(geocodeURL, function (error, response, body) {
        if (error) {
          log('error:', error); // Print the error if one occurred
          reject(error);
          //return {};
        }else{
          //log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          // parse json data
          var data = JSON.parse(body);
          resolve(data.results);
          //return obj;
        }
      });
    });
  //}
}

//*************************************************************************
//prepare the URL and start to retrieve user input

preparedURL = preparedURL.concat(prepareStatement(params));
recursiveAsyncReadLine();
//console.log('\x1b[36m%s\x1b[0m', 'I am cyan');
//*************************************************************************



