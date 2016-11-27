var util = require('util');

var w = "Sää tänään %s: %s %s %s, %s, %s."
var a = "Ilmanlaatu on %s."

const yksikotmap = {
  '0': 'nolla', '1':'yksi', '2':'kaksi', '3':'kolme', '4':'neljä',
  '5':'viisi', '6':'kuusi', '7':'seitsemän', '8':'kahdeksan',
  '9':'yhdeksän', '10': 'kymmenen'
};
const kymmenetmap = {
  '1':'toista', '2':'kymmentä'
};
const fiilismap = {
  '0':'pakkasta', '1':'lämmintä', '2':''
};
const tuulimap = {
  'N':'pohjoisesta', 'NE':'koillisesta', 'E':'idästä', 'SE':'kaakosta',
  'S':'etelästä', 'SW':'lounaasta', 'W':'lännestä', 'NW':'luoteesta'
};

function lukukirjaimiksi(luku) {
  if (luku >= 0 && luku < 11)
    return yksikotmap[luku];
  else if (luku > 10 && luku < 20)
    return yksikotmap[1] + kymmenetmap[1];
  else if (luku >= 20 && luku < 99) {
    var asteet = yksikotmap[Math.floor(luku/10)] + kymmenetmap[2];
    var ykkoset = luku % 10;
    if (ykkoset > 0)
      asteet = asteet + yksikotmap[ykkoset];
    return asteet;
  }
  return undefined;
}

function asteita(lampo) {
  var a = "aste";
  if (Math.abs(lampo) == 1)
    return a
  else
    return a + "tta"
}

function taivutusmuoto(kaupunki) {
  if (kaupunki == 'Tampere')
      return kaupunki + "ella"
  else if (kaupunki.indexOf('Turku') != -1)
      return "Turussa"
  else
      return kaupunki
}

function lampotila(lampo) {
    if (lampo < 0)
      return fiilismap[0];
    else if (lampo > 0)
      return fiilismap[1];
    else
      return fiilismap[2];
}

function tuuli(speed, direction) {
  if (speed == 0)
    return "tyyntä";
  else
    return util.format("tuuli %s %s metriä sekunnissa",
                        tuulimap[direction], yksikotmap[speed]);
}

function pilvisyys(clouds) {
  if (clouds.indexOf('melk.') != -1)
    return clouds.replace('melk.', 'melko ')
  else
    return clouds;
}

function ilmanlaatu(airquality) {
  // process airquality data from the first station on
  // until there is a measurement
  laatu = "ei ole saatavilla";
  for (i = 0; i < airquality.length; i++) {
    if (airquality[i].error == false) {
      laatu = airquality[i].FI;
      break;
    }
  }
  return laatu;
}

var phrase = function (weather, airquality) {
  var r = '';
  if (weather == undefined && airquality == undefined)
    return undefined;
  if (weather != undefined)
    r = r + util.format(w, taivutusmuoto(weather.city),
                           lukukirjaimiksi(Math.abs(weather.temperature)),
                           asteita(weather.temperature),
                           lampotila(weather.temperature),
                           tuuli(weather.windSpeed, weather.windDirection),
                           pilvisyys(weather.clouds));
    if (airquality != undefined)
      r = r + " ";
  if (airquality != undefined)
    r = r + util.format(a, ilmanlaatu(airquality));
  return r;
};

module.exports.phrase = phrase;
module.exports.lukukirjaimiksi = lukukirjaimiksi;
