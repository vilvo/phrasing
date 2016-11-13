var express = require('express');
var router = express.Router();

// hae sää- ja ilmanlaatutiedot 
router.get('/', function(req, res, next) {
    // mock tulokset
    var result = {
        temperature: -4,
        windDirection: "etelä",
        windSpeed: 4,
        city: "Tampere",
        clouds: "pilvistä",
        phrase: "Sää tänään Tampereella: pakkasta neljä astetta, tuuli etelästä neljä metriä sekunnissa, pilvistä. Ilmanlaatu on hyvä."
    };
    
  res.send( result );
});

module.exports = router;
