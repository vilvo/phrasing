var ttv = require('./ttvconnector.js');
var biomi = require('./biomiConnector.js');

// listaa kaupungit joista saa sää- ja/tai ilmanlaatutietoja
function getStations( req, res ) {
    ttv.stations( function ( err, weatherCities ) {
        if ( err ) {
            res.status( 500 );
            return res.send( { message: err.message });
        }
        
        var result = {}; // kerätään kaupungit tähän
        for ( var i = 0; i < weatherCities.length; i++ ) {
            var city = weatherCities[i];
            // säätiedot saadaan ja oletetaan tässä vaiheessa että ilmanlaatua ei saada
            result[city] =  { hasWeather: true, hasAirquality: false };
        }
        
        var airqualityCities = biomi.getStations();
        for ( var i = 0; i < airqualityCities.length; i++ ) {
            var city = airqualityCities[i];
            var info = result[city];
            if ( info === undefined ) {
                // tätä kaupunkia ei löytynyt säätiedoista
                info = { hasWeather: false };
                result[city] = info;
            }
            
            info.hasAirquality = true;
        }
        
        res.send( result );
    });
}

module.exports = { getStations: getStations };