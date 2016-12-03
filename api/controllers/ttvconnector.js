var request = require('request');

var APIKEY = process.env.TTV_KEY || "insert-your-apikey-here";
var TTV_WEATHER="http://beta.yle.fi/api/ttvcontent/?a="+APIKEY+"&p=402&c=true";

var weather = function (city, callback) {

  if (TTV_WEATHER.indexOf("insert-your-apikey-here") !== -1) {
      console.log("TTV_WEATHER url should contain proper API-key!");
      return;
  }

  request(TTV_WEATHER, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      
      // muuttuja löytyikö säätietoja
      var found = info.pages[0].subpages[0].content.split('\n').some(function(item){
            var weatherInfo = item.split(new RegExp("\\[[a-z]{4}\\]"));
            if ( weatherInfo.length > 1 ) {
                var cityName = weatherInfo[1].trim();
                if ( cityName === city ) {
                    var result = {
                        temperature: Number( weatherInfo[2].trim() ),
                        windDirection: weatherInfo[3].trim(),
                        windSpeed: Number( weatherInfo[4].trim() ),
                        city: cityName,
                        clouds: weatherInfo[5].trim().toLowerCase()
                    };
                    callback(undefined, result);
                    return true;
                }
            }
            
            return false;
      });
      
      if ( !found ) {
          // sää tietoja ei löytynyt
          callback( null, null );
      }
      }
    });
};

module.exports.weather = weather;
