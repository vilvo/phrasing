var express = require('express');
var router = express.Router();
var ttv = require('./ttvconnector.js');


// hae sää- ja ilmanlaatutiedot
router.get('/', function(req, res, next) {
  ttv.weather("Tampere", function(err, result) {
      res.send( result );
  });
});

module.exports = router;
