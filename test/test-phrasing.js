var assert = require('assert');
var phrasing = require('../api/controllers/phrasing-fi.js');

describe('phrasing', function() {
  describe('#phrase undefined, undefined', function() {
    it('should phrase undefined for undefined, undefined', function(){
        assert.equal(undefined, phrasing.phrase(undefined, undefined));
    });
  });
  describe('#phrase luku kirjaimiksi', function(){
    it('should phrase 1 to "yksi"', function() {
      assert.equal("yksi", phrasing.lukukirjaimiksi(1));
    });
    it('should phrase 11 to "yksitoista"', function() {
      assert.equal("yksitoista", phrasing.lukukirjaimiksi(11));
    });
    it('should phrase 13 to "kolmetoista"', function() {
      assert.equal("kolmetoista", phrasing.lukukirjaimiksi(13));
    });
    it('should phrase 20 to "kaksikymmentä"', function() {
      assert.equal("kaksikymmentä", phrasing.lukukirjaimiksi(20));
    });
    it('should phrase 33 to "kolmekymmentäkolme"', function() {
      assert.equal("kolmekymmentäkolme", phrasing.lukukirjaimiksi(33));
    });
    it('should phrase 50 to "viisikymmentä"', function() {
      assert.equal("viisikymmentä", phrasing.lukukirjaimiksi(50));
    });
    it('should phrase 0 to "nolla"', function() {
      assert.equal("nolla", phrasing.lukukirjaimiksi(0));
    });
    it('should phrase 100 to undefined', function() {
      assert.equal(undefined, phrasing.lukukirjaimiksi(100));
    });
  });
  describe('#phrase Tampere with const input data', function(){
    it('should phrase with const input data T1', function() {
      const T1 = {
          temperature: -1,
          windDirection: 'NW',
          windSpeed: 4,
          city: 'Tampere',
          clouds: 'lumisadetta'
      };
      const s = "Sää tänään Tampereella: yksi aste pakkasta, " +
                "tuuli luoteesta neljä metriä sekunnissa, lumisadetta."
      assert.equal(s, phrasing.phrase(T1), undefined);
    });
    it('should phrase with const input data T2', function() {
      const T2 = {
          temperature: -1,
          windDirection: 'N',
          windSpeed: 6,
          city: 'Turku',
          clouds: 'melk.pilvistä'
      };
      const s = "Sää tänään Turussa: yksi aste pakkasta, " +
                "tuuli pohjoisesta kuusi metriä sekunnissa, melko pilvistä."
      assert.equal(s, phrasing.phrase(T2), undefined);
    });
    it('should phrase with const air quality data', function(){
      const AQ = [ { time: 11, index: 1, FI: "hyvä", EN: "good",
                     error: false, station: "Linja-autoasema" } ]
      assert.equal("Ilmanlaatu on hyvä.", phrasing.phrase(undefined, AQ));
    });
  });
});
