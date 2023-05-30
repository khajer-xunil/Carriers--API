function DHL_trackingNumber(trackingNumber) {
  
  // Parameters to retrieve JSON data
  const options = {  
                      muteHttpExceptions: true,
                      method: 'get',      
                      headers:{'DHL-API-Key': '******'},
                    };
  
  // Fetch JSON data
  var url = "https://api-eu.dhl.com/track/shipments?trackingNumber=" + trackingNumber;

  // JSON Data
  var response = UrlFetchApp.fetch(url,options);

  //Check error code
    if (response.getResponseCode() !== 200){
        return "Tracking number not found/not picked up"
      }else{
        // Parse the API response and get the shipment status and date of the delivery
        var data = JSON.parse(response.getContentText());

        //Shipment status from JSON
        var shipmentStatus = data.shipments[0].status.description;
        var deliveryDate = Utilities.formatDate(new Date(data.shipments[0].status.timestamp),"GMT","dd/MM"); 
        return shipmentStatus + " " + deliveryDate;
        }
}
