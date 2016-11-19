var express = require('express');
var router = express.Router();
var ttv = require('./ttvconnector.js');
var biomi = require( './biomiConnector.js' )


// hae sää- ja ilmanlaatutiedot
router.get('/', function(req, res, next) {
    var city = 'Tampere';
  ttv.weather( city, function(err, result) {
      biomi.getAirqualityForCity( city, function( err, biomiResult ) {
          if ( err ) {
              return res.send( err.message );
          }
          
          result.airquality = biomiResult;
          res.send( result );
      })
      
  });
});

module.exports = router;
