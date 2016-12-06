var async = require('async');
var ttv = require('./ttvconnector.js');
var biomi = require('./biomiConnector.js');
var phrasing = require('./phrasing-fi.js');

// hae sää- ja ilmanlaatutiedot annetulle kaupungille
function getData(req, res) {
    // kaupungin nimi on URL:in polussa
    var city = req.swagger.params.city.value;
    // haetaan sää- ja ilmanlaatutiedot  rinakkain ja käsitellään tulos
    // kun molemmat on haettu
    async.parallel( {
        weather: function ( callback ) {
            ttv.weather( city, callback );
        },
        airquality: function ( callback ) {
            biomi.getAirqualityForCity( city, callback );
        }
    }, function ( err, results ) {
        if ( err ) {
            // jompi kumpi operaatio epäonnistui
            // katsotaan koko homma epäonnistuneeksi
            return res.send( { message: err.message });
        }
        
        // results.weather ja results.airquality sisältää rinnakkain ajettujen funktioiden tulokset
        
        if ( results.airquality.length === 0 ) {
            // paikkakunnalta ei ole saatavissa ilmanlaatutietoa
            results.weather.hasAirquality = false;
        }

        else {
            results.weather.hasAirquality = true;
        }
        
        // results.weather palautetaan käyttäjälle
        results.weather.airquality = results.airquality;

        // tarkista jos ei löydetty kumpiakaan tietoja
        if ( !results.weather.hasWeather && !results.weather.hasAirquality ) {
            results.weather.phrase = "Tietoja ei löytynyt kaupungille " +city +".";
            return res.send( results.weather );
        }
        
        // rakenna tiedoista lause
        results.weather.phrase = phrasing.phrase(results.weather,
                                                 results.airquality);
        res.send( results.weather );
    });
}
/*
function getStations(req, res) {
  async.parallel( {
      stations: function ( callback ) {
          ttv.stations( callback );
      }, function (err, results) {
        if (err)
          return res.send({message:err.message});
      }
      console.log(results.stations);
      res.send(results.stations);
  });
}
*/
module.exports = { getData: getData };
