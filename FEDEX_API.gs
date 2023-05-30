function FedEx_trackingNumber(fedex_token,trackingNumber) {


// Parameters for header (token and content type) 
var data_trackingNumber_header = {
  "authorization" : "Bearer "+ fedex_token,
  "content-type" : "application/json", 
};


// Parameters for payload 
var data_trackingNumber_payload = {
  "includeDetailedScans" : false,
  "trackingInfo" : [{"trackingNumberInfo" : {"trackingNumber" : trackingNumber}}],
};

// Parameters to retrieve JSON data 
var options_trackingNumber = {
  method : "post",
  headers : data_trackingNumber_header,
  payload : JSON.stringify(data_trackingNumber_payload),
  muteHttpExceptions : true,
};


// URL to fetch JSON data from FedEx 
var response_trackingNumber = UrlFetchApp.fetch("https://apis.fedex.com/track/v1/trackingnumbers", options_trackingNumber);


// Check response code if the tracking number exists or not, response code 200 - tracking number exists, other codes FedEx developer kit
if (response_trackingNumber.getResponseCode() !== 200){
    return "Shipmnet not found or another problem " + response_trackingNumber.getResponseCode();   
}else{
    // Parse JSON
    var output_trackingNumber = JSON.parse(response_trackingNumber);

    // There is a problem that the response from server for non-exist tracking number was the same - RC 200
    // Condition to avoid this problem and get the error message
    if (output_trackingNumber.output.completeTrackResults[0].trackResults[0].trackingNumberInfo.carrierCode == ""){
        return output_trackingNumber.output.completeTrackResults[0].trackResults[0].error.message;
    }else{
      // Status of the shipment
      status_FedEx = output_trackingNumber.output.completeTrackResults[0].trackResults[0].latestStatusDetail.description;

      // Delivery date of the shipment
      var deliveryDate_FedEx = Utilities.formatDate(new Date(output_trackingNumber.output.completeTrackResults[0].trackResults[0].scanEvents[0].date),"GMT","MM/dd");
      
      // Return shipment status to the main code
      return (status_FedEx + " " + deliveryDate_FedEx);
    }
}
}
