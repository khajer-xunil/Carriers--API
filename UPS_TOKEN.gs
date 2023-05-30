function UPS_token() {

  // Client credentials
  const client_id = "******";
  const client_secret = "******";
  
  //Encode Client ID + Client Secret
  var data_token = {
    "Authorization" : "Basic " + Utilities.base64Encode(client_id + ":" + client_secret),
  }

  // Payload date for the body
  var data_payload = {
    "grant_type" : "client_credentials",
  }

  // Parameters to retrieve Token
  var options_token = {
    "method" : "post",
    "headers" : data_token,
    "payload" : data_payload,
  }

  // Fetch token
  var response_token = UrlFetchApp.fetch("https://onlinetools.ups.com/security/v1/oauth/token",options_token);
  
  // Parse JSON
  var token = JSON.parse(response_token) 

  // Token
  var ups_token = token.access_token;

  // Return UPS token to the main code
  return ups_token;
}
