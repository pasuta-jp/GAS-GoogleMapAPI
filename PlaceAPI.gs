function PlaceAPI() {
  /*var url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
            "?language=en" +
            "&input=Restaurant" +　　　　　　　　　　　　 
            "&inputtype=textquery" +                 
            "&fields=formatted_address,geometry,name,place_id" +
            "&locationbias=circle:50000@13.751012,100.518594" + 
            "&key=XXXXXXXXXXXXXXXXXXXXXXXXXXX";   */

  var url =
    "https://maps.googleapis.com/maps/api/place/textsearch/json" +
    "?language=en" +
    "&query=restaurant" +
    "&location=13.751012,100.518594" +
    "&radius=5" +
    "&key=XXXXXXXXXXXXXXXXXXXX";

  Logger.log(url);
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(res);

  var json = JSON.parse(res.getContentText());
  Logger.log(json);
  Logger.log(json["results"].length);

  if (json["status"] == "OK") {
    var json_formatted_address = json["results"][0]["formatted_address"];
    var json_lat = json["results"][0]["geometry"]["location"]["lat"];
    var json_lng = json["results"][0]["geometry"]["location"]["lng"];
    var json_name = json["results"][0]["name"];
    var json_id = json["results"][0]["place_id"];
    var json_rating = json["results"][0]["rating"];
    var json_ratingnum = json["results"][0]["user_ratings_total"];
    var info = [
      json_name,
      json_formatted_address,
      json_lat,
      json_lng,
      json_id,
      json_rating,
      json_ratingnum,
    ];
    Logger.log(info);
    return info;
  } else {
    return ["", "", "", "", "", "", ""];
  }
}
