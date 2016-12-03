var fs = require( 'fs' );
var request = require( 'request' );
var async = require( 'async' );

try {
    var stations = JSON.parse( fs.readFileSync( 'airquality_stations/stations.json' ));
}

catch ( err ) {
    console.log( 'Exiting. Could not load airquality stations:' );
    console.log( err.message );
    process.exit();
}

function getAirqualityForCity( city, callback ) {
    var cityStations = stations[city];
    if ( cityStations === undefined ) {
        return callback(  null, [] );
    }
    
    async.map( cityStations, getAirqualityForStation, callback );
}

function getAirqualityForStation( station, callback ) {
    var params = { p: 'qualityIndex', ss: station.id };
    request.get( {
        url: 'http://biomi.kapsi.fi/tools/airquality/',
        qs: params,
        json: true
    }, function ( err, response, body ) {
        if ( err ) {
            return callback( err  );
        }
        
        else if ( response.statusCode != 200 ) {
            return callback( new Error( response.statusCode +' status from biomi API'))
        }
        
        if ( body.error ) {
            var measurement = { error: true, message: body.message };
        }
        
        else {
            var measurement = body.latest;
            measurement.error = false;
            delete measurement.parts;
        }
        
        measurement.station = station.location;

        callback( null, measurement );
    });
}

// palauta lista kaupungeista, joista saa ilmanlaatu tietoja
function getStations() {
    return Object.keys( stations );
}

module.exports = {
    getAirqualityForCity: getAirqualityForCity,
    getStations: getStations
};