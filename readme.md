# Sää-ja ilmanlaatutietopalvelu fraaseilla

## Yleiskuvaus

Palvelu tarjoaa REST-rajapinnan kautta sää- ja ilmanlaatutietoa sekä fraaseina
että rakenteellisena tietona. Palvelu toteuttaa kurssi [Palvelupohjaiset järjestelmät](http://palpo.github.io/)-harjoitustyön.

## Suunnitelma

Phrasing palvelu tarjoaa kyselyrajapinnan jonka tietolähteinä suunnitellaan alustavasti käytettävän [YLEn Teksti-TV APIa](http://apisuomi.fi/shop/json/yle-teksti-tv-api/) tai [Ilmatieteenlaitoksen avoimen datan APIa](https://ilmatieteenlaitos.fi/avoin-data) paikkakuntakohtaiselle säätiedolle sekä [Biomin ilmanlaaturajapintaa])(https://www.biomi.org/web/ilmanlaaturajapinta/).

Phrasing-palvelu yhdistää ja muokkaa tietolähteiden avointa dataa tarjoten sitä sekä fraaseina että rakenteellisesti.

### Esimerkki

Käyttäjä on kiinnostunut paikkakuntansa säästä ja ilmanlaadusta. Hän haluaa tiedoista ihmisen ymmärtämän, koneluettavan fraasin ja lisäksi yksityiskohtaiset tiedot lähempää tarkastelua varten. Palvelu palauttaa kyselystä esimerkiksi fraasin:
> Sää tänään Tampereella: pakkasta neljä astetta, tuuli etelästä neljä metriä sekunnissa, pilvistä. Ilmanlaatu on hyvä."

Lisäksi sää- ja ilmanlaatutietojen yksityiskohdat on saatavissa JSON-muodossa.

### Query-parametrit (alustava)

* `cityname` - paikkakunnan nimi, vaihtoehtoinen `coordinates`:n kanssa
* `coordinates` - sijainnin koordinaatit, vaihtoehtoinen `cityname`:n kanssa 
... `cityname` käytetään suoraan tietolähteiden kanssa
... `coordinates` saatetaan mäpätä paikkakunnaksi karttarajapintoja käyttäen tai toteuttaa mockkina.
* `weather` - true tai false - kysytäänkö säätietoa vai ei
* `airquality` - true tai false - kysytäänkö ilmanlaatua vai ei
* `language` - FI|EN - standardit kielikoodit
* `detailed` - true tai false - palautetaanko yksityiskohtainen data vai ei
* `phrase` - true tai false - palautetaanko fraasi vai ei

Lisäksi suunniteltiin HTTP headerin Accept-kentän käyttöä määrittämään hyväksyttävät vastaustyypit. Esimerkiksi `Accept: text/plain` pelkät vastaustiedot kun taas `Accept: application/JSON` palauttaisi vastaustiedot JSON-muodossa.

#### Huomioita query-parametreistä ja paluuarvoista

* HTTP 400 (bad request) -> detailed(true) + phrase(true) with accept: text/plain
* HTTP 400 (bad request) -> detailed(false) + phrase (false)

### Toteutus

node.js + Express, Heroku
Dokumentaatio: swagger.io
Testit + CI + deployment (avoin)

### Client-demot (alustava)

Paluuarvojen muuttaminen ääneksi puhesynteesin kautta - esim. https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API -> "Ääni"
