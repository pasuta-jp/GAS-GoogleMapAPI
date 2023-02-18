var APIKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var Radius = "200"; //Radius(m)
//四隅の左上A、右上B、左下C
var latA = 36.153267;
var lngA = 139.970921;
var latB = 36.154791;
var lngB = 139.992293;
var latC = 36.136632;
var lngC = 139.969033;

function main() {
  GeoCalc();
  GetAndWritePlaceData();
}

function GeoCalc() {
  //Dist(km)
  //測地線航海算法（Lambert-Andoyer）
  //誤差評価　https://petit-noise.net/blog/%E7%B7%AF%E5%BA%A6%E7%B5%8C%E5%BA%A6%E3%81%8B%E3%82%892%E7%82%B9%E9%96%93%E3%81%AE%E8%B7%9D%E9%9B%A2%E3%82%92%E6%B1%82%E3%82%81%E3%82%8B/

  with (Math) {
    var DistHor =
      acos(
        sin(latA * (PI / 180)) * sin(latB * (PI / 180)) +
          cos(latA * (PI / 180)) *
            cos(latB * (PI / 180)) *
            cos(lngA * (PI / 180) - lngB * (PI / 180))
      ) * 6371.008;
  }
  with (Math) {
    var DistVar =
      acos(
        sin(latC * (PI / 180)) * sin(latA * (PI / 180)) +
          cos(latC * (PI / 180)) *
            cos(latA * (PI / 180)) *
            cos(lngC * (PI / 180) - lngA * (PI / 180))
      ) * 6371.008;
  }
  var DivNumHor = Math.floor(DistHor / (2 * (Number(Radius) / 1000)));
  var DivNumVar = Math.floor(DistVar / (2 * (Number(Radius) / 1000)));
  var LatUnit = Math.abs(latA - latC) / DivNumVar;
  var LngUnit = Math.abs(lngA - lngB) / DivNumHor;

  var GeoBox = new Array((DivNumHor - 1) * (DivNumVar - 1));
  for (let i = 0; i < (DivNumHor - 1) * (DivNumVar - 1); i++) {
    GeoBox[i] = new Array(2);
  }
  //最大充填率ではない
  var count = 0;
  for (var i = 0; i <= DivNumHor - 2; i++) {
    for (var j = 0; j <= DivNumVar - 2; j++) {
      GeoBox[count][0] = latA - LatUnit * (j + 1);
      GeoBox[count][1] = lngA + LngUnit * (i + 1);
      count = count + 1;
    }
  }
  return GeoBox;
}
//修正途中

function GetAndWritePlaceData() {
  var GeoBox = GeoCalc();
  for (var k = 0; k <= GeoBox.length - 1; k++) {
    var url =
      "https://maps.googleapis.com/maps/api/place/textsearch/json" +
      "?language=en" +
      "&query=restaurant" +
      "&location=" +
      String(GeoBox[k][0]) +
      "," +
      String(GeoBox[k][1]) +
      "&radius=" +
      Radius +
      "&key=" +
      APIKey;
    Logger.log(url);
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
        var lastRow = sh.getLastRow();
        //重複確認
        var textFinder = sh.createTextFinder(json_id);
        var findbox = textFinder.findAll();
        if (findbox.length != 0) {
          continue;
        }
        sh.getRange(lastRow + 1, 1).setValue(info[0]);
        sh.getRange(lastRow + 1, 2).setValue(info[1]);
        sh.getRange(lastRow + 1, 3).setValue(info[2]);
        sh.getRange(lastRow + 1, 4).setValue(info[3]);
        sh.getRange(lastRow + 1, 5).setValue(info[4]);
        sh.getRange(lastRow + 1, 6).setValue(info[5]);
        sh.getRange(lastRow + 1, 7).setValue(info[6]);
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
        sh.getRange(lastRow + 1, 8).setValue(googleMapsUrl);
      }
    } else {
      return ["", "", "", "", "", "", ""];
    }
  }
}
