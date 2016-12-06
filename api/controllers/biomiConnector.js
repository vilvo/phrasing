// moduuli ilmanlaatutietojen hakemiseen

var fs = require( 'fs' );
var request = require( 'request' );
var async = require( 'async' );

// lue lista ilmanlaatumittauspaikoista tiedostosta
// jos luku ei onnistu sulje ohjelma
try {
    var stations = JSON.parse( fs.readFileSync( 'airquality_stations/stations.json' ));
}

catch ( err ) {
    console.log( 'Exiting. Could not load airquality stations:' );
    console.log( err.message );
    process.exit();
}

// funktio hakee annetun kaupungin ilmanlaatutiedot kaupungin eri mittausasemilta
function getAirqualityForCity( city, callback ) {
    // kaupungin mittausasemat
    var cityStations = stations[city];
    if ( cityStations === undefined ) {
        // annetulla kaupungilla ei ole mittausasemia
        return callback(  null, [] );
    }
    
    // hae rinnakkaisesti kaikkien asemien mittaukset
    // getAirqualityForStation kutsutaan jokaiselle mittausasemalle
    // callbackille tulee lista tuloksia
    async.map( cityStations, getAirqualityForStation, callback );
}

// hae annetun aseman mittaukset 
// station on yhden aseman tiedot sisältävä olio mittausasema tiedostosta
function getAirqualityForStation( station, callback ) {
    // query parametrit ilmanlaatu rajapinnalle
    // haluamme laatuindeksin aseman id:n perusteella
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
            // asemalta ei jostainsyystä ole tietoja saatavilla
            var measurement = { error: true, message: body.message };
        }
        
        else {
            var measurement = body.latest;
            measurement.error = false;
            // poistetaan tarkempi mittaustieto
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