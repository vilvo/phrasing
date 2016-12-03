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

        // tarkista jos ei löydetty kumpiakaan tietoja 
        if ( results.weather === null && results.airquality.length === 0 ) {
            return res.send( { phrase: "Tietoja ei löytynyt kaupungille " +city +"."  });
        }
        
        results.weather.airquality = results.airquality;
        results.weather.phrase = phrasing.phrase(results.weather,
                                                 results.airquality);
        res.send( results.weather );
    });
}

module.exports = { getData: getData };
