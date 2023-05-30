function FedEx_token() {
  
  //body data
 const data_token = {
    "grant_type": "client_credentials",
	  "client_id": "******",
		"client_secret": "******"
 };
// parameters for input to retrieve JSON
 var options_token = {
   "method" : "post",
   "payload" : data_token,
 }


  //JSON response
  var response_token = UrlFetchApp.fetch("https://apis.fedex.com/oauth/token",options_token);
  var output_token = JSON.parse(response_token);
 
  //Access token
  var fedex_token = output_token.access_token;

  // Return generated token
  return fedex_token;
}
