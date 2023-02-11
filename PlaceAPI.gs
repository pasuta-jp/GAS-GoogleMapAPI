function GetAndWritePlaceData() {
  var url =
    "https://maps.googleapis.com/maps/api/place/textsearch/json" +
    "?language=en" +
    "&query=restaurant" +
    "&location=13.751012,100.518594" +
    "&radius=50000" +
    "&key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var json = JSON.parse(res.getContentText());
  var bk = SpreadsheetApp.getActiveSpreadsheet();
  var sh = bk.getSheetByName("List1");
  var RowLength = json["results"].length;

  if (json["status"] == "OK") {
    for (var i = 0; i <= RowLength - 1; i++) {
      var json_formatted_address = json["results"][i]["formatted_address"];
      var json_lat = json["results"][i]["geometry"]["location"]["lat"];
      var json_lng = json["results"][i]["geometry"]["location"]["lng"];
      var json_name = json["results"][i]["name"];
      var json_id = json["results"][i]["place_id"];
      var json_rating = json["results"][i]["rating"];
      var json_ratingnum = json["results"][i]["user_ratings_total"];
      var info = [
        json_name,
        json_formatted_address,
        json_lat,
        json_lng,
        json_id,
        json_rating,
        json_ratingnum,
      ];
      sh.getRange(i + 2, 1).setValue(info[0]);
      sh.getRange(i + 2, 2).setValue(info[1]);
      sh.getRange(i + 2, 3).setValue(info[2]);
      sh.getRange(i + 2, 4).setValue(info[3]);
      sh.getRange(i + 2, 5).setValue(info[4]);
      sh.getRange(i + 2, 6).setValue(info[5]);
      sh.getRange(i + 2, 7).setValue(info[6]);
      //Logger.log(i);
      //const common = 'https://www.google.com/maps/place/';
      //let replaceWord = / /g;
      //var json_name_fix = json_name.replace(replaceWord, "+");
      //const googleMapsUrl = common + json_id;
      var lonLat = json_lat + "," + json_lng;
      const googleMapsUrl =
        "https://www.google.com/maps/search/?api=1&query=" +
        lonLat +
        "&query_place_id=" +
        json_id;
      sh.getRange(i + 2, 8).setValue(googleMapsUrl);
    }
  } else {
    return ["", "", "", "", "", "", ""];
  }
}
