function datascan_collections() {

  var Delivered = 0;
  var Not_delivered = 0;
  var Required = 0;
  var Delivered_row = [];

  //Today date  
  const todayDate = Utilities.formatDate(new Date(),"GMT+1","MM/dd/YYYY");
 

  // Get the active sheet "2023"
  var sheet = SpreadsheetApp.getActive().getSheetByName("2023");

  //Find the last row
  var lastRow = sheet.getLastRow();

  //Get UPS token
  var ups_token = UPS_token();

  //Get FedEx token
  var fedex_token = FedEx_token();
 

  // Loop through the values and retrieve shipment status for each tracking number
  for (var i = 2; i <= lastRow; i++) {
    

    var shipmentStatus = "";
    var trackingNumber = "";

    // Check carrier 
    var carrier = sheet.getRange(i, 14).getValue();
  
    // Check how many attempt has been done
    var attempt = sheet.getRange(i , 15).getValue();

    // Check font color (grey #b7b7b7 = complete)
    var color = sheet.getRange(i, 1).getFontColorObject().asRgbColor().asHexString();

    // Check date of pick up
    var pickUpDate = Utilities.formatDate(new Date(sheet.getRange(i, 6).getValue()),"GMT+1","MM/dd/YYYY");


    // Validate if shipment was delivered and pick up date is lower or equal today 
        if ((color != "#b7b7b7" && pickUpDate <= todayDate) && attempt >= 1){

        // Make the API request to retrieve shipment status according to the carrier
        
          switch(carrier){
          // DHL
          case "DHL":
           
          case "return DHL": 

          case "DHL EC":      

          case "return DHL economy":
            trackingNumber = sheet.getRange(i,15 + ((attempt*2)-1)).getValue().toString();
            if(trackingNumber.length == 10){ 
              shipmentStatus = DHL_trackingNumber(trackingNumber);
            }else{
              trackingNumber = trackingNumber.slice(18,28);
              shipmentStatus = DHL_trackingNumber(trackingNumber);
            }
            break;
          
          // UPS
          case "UPS EC":

          case "UPS":
            trackingNumber = sheet.getRange(i,15 + ((attempt*2)-1)).getValue().toString();
            // Check the lenght of tracking number, 18 is a standard length 
            if(sheet.getRange(i, 15 + (attempt*2)).getValue().toString().includes("TW0001")){
              shipmentStatus = sheet.getRange(i, 15 + (attempt*2)).getValue();
              break;
            }else if(trackingNumber.length == 18 ){
              shipmentStatus = UPS_tracking(trackingNumber,ups_token); 
            }else{
              trackingNumber = trackingNumber.slice(0,18);
              console.log(trackingNumber)
              shipmentStatus = UPS_tracking(trackingNumber,ups_token);
            }
            break;

          // FedEx
          case "FedEx 221885619":

          case "FedEx":
            trackingNumber = sheet.getRange(i,15 + ((attempt*2)-1)).getValue().toString();
            shipmentStatus = FedEx_trackingNumber(fedex_token,trackingNumber);
            break;

          //TNT
          case "TNT":
            trackingNumber = sheet.getRange(i,15 + ((attempt*2)-1)).getValue().toString();
            shipmentStatus = TNT_trackingNumber(trackingNumber);
            break;

          default:
            sheet.getRange(i,15 + ((attempt*2)-1)).setValue("Carrier not found");
            break;
        }
          if(shipmentStatus.substring(0,9) == "Delivered"){
          sheet.getRange(i, 15 + (attempt*2)).setValue(shipmentStatus).setFontStyle("italic");
          sheet.getRange(i, 1, 1, 26).setFontColor("#b7b7b7").setFontFamily("Times New Roman");
          Delivered += 1;
          Delivered_row.push(i);
          }else{
          sheet.getRange(i, 15 + (attempt*2)).setValue(shipmentStatus).setFontStyle("italic").setFontColor(color).setFontFamily("Times New Roman");
          Not_delivered += 1;
          }
        }else{
          if (color == "#b7b7b7"){
            continue;
          }else{
            if(attempt == 0){
              sheet.getRange(i, 17).setValue("Tracking number missing").setFontStyle("italic").setFontColor(color).setFontFamily("Times New Roman");
            }else{
              sheet.getRange(i, 15 + (attempt*2)).setValue("Required pick up date is not today!").setFontStyle("italic").setFontColor(color).setFontFamily("Times New Roman");
              Required += 1;
            }
          }
        }
  }

  var sheet_2 = SpreadsheetApp.getActive().getSheetByName("Last Update");
  sheet_2.getRange(1, 2).setValue(Delivered);
  sheet_2.getRange(2, 2).setValue(Not_delivered);
  sheet_2.getRange(3, 2).setValue(Required) 
  for(z=0;z<Delivered_row.length;z++){
    sheet_2.getRange(6, z+1).setValue(Delivered_row[z]);
  }
}
