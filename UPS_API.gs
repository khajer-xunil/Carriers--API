function UPS_tracking(trackingNumber,ups_token) {


// Parameters for the header
const parameters = {
    "Authorization" : "Bearer " + ups_token,
    "transId" : "testing",
    "transactionSrc" : "testing",
    "content-type" : "application/json",
}

// Parameters to retrieve JSON data 
var options = {
    method : 'get',
    headers : parameters,
    muteHttpExceptions: true,
}

// URL to fetch JSON
var url = "https://onlinetools.ups.com/api/track/v1/details/" + trackingNumber;

// Fetch JSON
var response = UrlFetchApp.fetch(url,options) ;

// Check Response Code 
// RC 200 = Success -> check status and delivery date, other codes = bad request, get Response code
// Return shipment status to the main code
if(response.getResponseCode() !== 200){
        return "Shipment not found or another problem" + " (" + response.getResponseCode() + ")"
}else{
    // Parse JSON
    var output_trackingNumber = JSON.parse(response);
    
    // Initialize variables
    var status_UPS = "";
    var deliveryDate_UPS = "";

    if((output_trackingNumber.trackResponse.shipment[0]).hasOwnProperty("package") && (output_trackingNumber.trackResponse.shipment[0].package[0].deliveryDate[0] != null)){
      deliveryDate_UPS = output_trackingNumber.trackResponse.shipment[0].package[0].deliveryDate[0].date;
      deliveryDate_UPS = deliveryDate_UPS.slice(4, 6) + "/" + deliveryDate_UPS.slice(6, 8);
      return ("Delivered " + deliveryDate_UPS);
      }else if(output_trackingNumber.trackResponse.shipment[0].hasOwnProperty("warnings")){
        status_UPS = output_trackingNumber.trackResponse.shipment[0].warnings[0].code;
        return ("Tracking number is older than 120 days code(" + status_UPS + ") - NOT DELIVERED!") 
    
      }else{
        status_UPS = output_trackingNumber.trackResponse.shipment[0].package[0].activity[0].status.description;
        deliveryDate_UPS = output_trackingNumber.trackResponse.shipment[0].package[0].activity[0].date;
        deliveryDate_UPS = deliveryDate_UPS.slice(4, 6) + "/" + deliveryDate_UPS.slice(6, 8);
        return (status_UPS + " " + deliveryDate_UPS);
      }
      }
}
