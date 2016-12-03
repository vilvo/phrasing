var async = require('async');
var ttv = require('./ttvconnector.js');
var biomi = require('./biomiConnector.js');
var phrasing = require('./phrasing-fi.js');

// hae sää- ja ilmanlaatutiedot
function getData(req, res) {
    var city = req.swagger.params.city.value;
    async.parallel( {
        weather: function ( callback ) {
            ttv.weather( city, callback );
        },
        airquality: function ( callback ) {
            biomi.getAirqualityForCity( city, callback );
        }
    }, function ( err, results ) {
        if ( err ) {
            return res.send( { message: err.message });
        }
        
        if ( results.airquality.length === 0 ) {
            results.weather.hasAirquality = false;
        }
        
        else {
            results.weather.hasAirquality = true;
        }
        
        results.weather.airquality = results.airquality;

        // tarkista jos ei löydetty kumpiakaan tietoja 
        if ( !results.weather.hasWeather && !results.weather.hasAirquality ) {
            results.weather.phrase = "Tietoja ei löytynyt kaupungille " +city +".";
            return res.send( results.weather );
        }
        
        results.weather.phrase = phrasing.phrase(results.weather,
                                                 results.airquality);
        res.send( results.weather );
    });
}

module.exports = { getData: getData };
