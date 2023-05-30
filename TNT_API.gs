function TNT_trackingNumber(trackingNumber) {
  
  const user_name = "******"
  const passcode = "******"
  
  const header = {
    "Authorization" : "Basic " + Utilities.base64Encode(user_name + ":" + passcode),
    "Content-type" : "application/json"
  }


  var body = {
    "TrackRequest" : {"searchCriteria" : {"consignmentNumber":[trackingNumber]},"locale" : "en_US", "version" : "3.1", "levelOfDetail" : {"summary" : {}}},
  }

  var options_trackingNumber = {
    "method" : "post",
    "headers" : header,
    "payload" : JSON.stringify(body),  
    "muteHttpExceptions" : true
  }


  var response = UrlFetchApp.fetch("https://necta.az.fxei.fedex.com/ectrack/jtrack",options_trackingNumber);


  var output_shipmentStatus = JSON.parse(response);
  var deliveryDate_TNT = "";
  var last_updateDate = "";

  var shipmentStatus = output_shipmentStatus.TrackResponse.consignment[0].summaryCode

  switch(shipmentStatus){
    case "DEL":
      deliveryDate_TNT = output_shipmentStatus.TrackResponse.consignment[0].deliveryDate.value;
      deliveryDate_TNT = deliveryDate_TNT.slice(4, 6) + "/" + deliveryDate_TNT.slice(6, 8)
      return "Delivered " + deliveryDate_TNT;
      
    case "INT":
      last_updateDate = output_shipmentStatus.TrackResponse.consignment[0].collectionDate.value;
      last_updateDate = last_updateDate.slice(4, 6) + "/" + last_updateDate(6, 8);
      return "In Transit " + last_updateDate;

    case "CNF":
      return "Tracking number not found";

    case "EXC":
      return "Exception";
  }
}
