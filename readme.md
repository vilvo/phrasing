# Sää-ja ilmanlaatutietopalvelu fraaseilla

## Yleiskuvaus

Palvelu tarjoaa REST-rajapinnan kautta sää- ja ilmanlaatutietoa sekä fraaseina
että rakenteellisena tietona. Palvelu toteuttaa kurssi [Palvelupohjaiset järjestelmät](http://palpo.github.io/)-harjoitustyön.

Phrasing palvelu tarjoaa kyselyrajapinnan jonka tietolähteinä käytetään  [YLEn Teksti-TV APIa](http://apisuomi.fi/shop/json/yle-teksti-tv-api/) paikkakuntakohtaiselle säätiedolle sekä [Biomin ilmanlaaturajapintaa](https://www.biomi.org/web/ilmanlaaturajapinta/).

Phrasing-palvelu yhdistää ja muokkaa tietolähteiden avointa dataa tarjoten sitä sekä fraaseina että rakenteellisesti.

### Esimerkki

Käyttäjä on kiinnostunut paikkakuntansa säästä ja ilmanlaadusta. Hän haluaa tiedoista ihmisen ymmärtämän, koneluettavan fraasin ja lisäksi yksityiskohtaiset tiedot lähempää tarkastelua varten. Palvelu palauttaa kyselystä esimerkiksi fraasin:
> Tampere: pakkasta neljä astetta, tuuli etelästä neljä metriä sekunnissa, pilvistä. Ilmanlaatu on hyvä."

Lisäksi sää- ja ilmanlaatutietojen yksityiskohdat on saatavissa JSON-muodossa.

## Toteutus

Phrasing palvelu on toteutettu node.js alustalle. Se käyttää [express](http://expressjs.com) web-kehystä. Toteutus pohjautuu [swagger node](https://github.com/swagger-api/swagger-node)-moduuliin, joka integroi [Swagger](http://swagger.io) rajapintakuvauskielen osaksi palvelua. Palvelun rajapinta on kuvattu swaggerilla ja swagger node huolehtii kuvausten mukaisesta pyyntöjen reitityksestä sekä pyyntöjen ja vastausten validoinnista. Palvelun dokumentaation esittämiseen käytetään palveluun integroitua selainpohjaista [Swagger UI](http://swagger.io/swagger-ui/) komponenttia. Ohjelman eräälle fraaseja tuottavalle moduulille on toteutettu yksikkötestit [mocha](https://mochajs.org)-testikehyksellä.

Phrasing-palvelu on ajossa [Heroku](https://phrasing-weather.herokuapp.com/client/)-palvelussa. Herokua varten on tehty automaattinen deployment tästä Github repositorysta. Kun master-haaraan lisätään uutta sisältöä, uusin versio päivittyy automaatisesti Herokuun.

## Client-demo

[Paluuarvojen muuttaminen ääneksi puhesynteesin kautta selain-clientissa](https://phrasing-weather.herokuapp.com/client/) Client on osa phrasing-palvelua ja on toteutettu [angular.js](https://angularjs.org)-käyttöliittymäkehyksellä.

## Rajapinta dokumentaatio

Phrasing-palvelun rajapinta on dokumentoitu swagger-kuvauskielellä ja löytyy [](api/swagger/swagger.yaml) tiedostosta. Phrasing-palvelu tarjoaa dokumentaatiosta [selaimella luettavan version](http://phrasing-weather.herokuapp.com/docs/).
