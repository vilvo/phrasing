var request = require('request');

var APIKEY = process.env.TTV_KEY || "insert-your-apikey-here";
var TTV_WEATHER="http://beta.yle.fi/api/ttvcontent/?a="+APIKEY+"&p=402&c=true";

function APIkeyAvailable() {
  if (TTV_WEATHER.indexOf("insert-your-apikey-here") !== -1) {
    console.log("TTV_WEATHER url should contain proper API-key!");
    return false;
  } else {
    return true;
  }
};

var weather = function (city, callback) {

  if (!APIkeyAvailable())
    return;

  request(TTV_WEATHER, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      // muuttuja löytyikö säätietoja
      var found = info.pages[0].subpages.some(function(subpage){
        return subpage.content.split('\n').some(function(item){
          var weatherInfo = item.split(new RegExp("\\[[a-z]{4}\\]"));
          if ( weatherInfo.length > 1 ) {
              var cityName = weatherInfo[1].trim();
              if ( cityName === city ) {
                var result = {
                  temperature: Number( weatherInfo[2].trim() ),
                  windDirection: weatherInfo[3].trim(),
                  windSpeed: Number( weatherInfo[4].trim() ),
                  city: cityName,
                  clouds: weatherInfo[5].trim().toLowerCase(),
                  hasWeather: true
                };
                callback(undefined, result);
                return true;
              }
          }
          return false;
        })
      });

      if ( !found ) {
          // sää tietoja ei löytynyt
          callback( null, { hasWeather: false } );
      }
      }
    });
};

var stations = function (callback) {
  if (!APIkeyAvailable())
    return;
  var s = [];
  request(TTV_WEATHER, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      info.pages[0].subpages.slice(0,1).forEach(function(subpage){
        subpage.content.split('\n').forEach(function(item){
          var weatherInfo = item.split(new RegExp("\\[[a-z]{4}\\]"));
          // TTV APIn sivut on ascii-dataa josta pitää poimia
          // tietyn mittaisia kenttiä - esim. kaupunkikenttä on 13 merkkiä
          if ( weatherInfo[1] != undefined && weatherInfo[1].length === 13 )
            s.push(weatherInfo[1].trim());
        })
      });
    }
    callback( null, s);
  });
};

module.exports.weather = weather;
module.exports.stations = stations;
