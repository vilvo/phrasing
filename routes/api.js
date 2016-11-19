var express = require('express');
var router = express.Router();
var async = require( 'async' );
var ttv = require('./ttvconnector.js');
var biomi = require( './biomiConnector.js' )

// hae sää- ja ilmanlaatutiedot
router.get('/', function(req, res, next) {
    var city = 'Tampere';
    async.parallel( {
        weather: function ( callback ) {
            ttv.weather( city, callback );
        },
        airquality: function ( callback ) {
            biomi.getAirqualityForCity( city, callback );
        } 
    }, function ( err, results ) {
        if ( err ) {
            return res.send( err.message );
        }
          
        results.weather.airquality = results.airquality;
        res.send( results.weather );
    });
});

module.exports = router;
