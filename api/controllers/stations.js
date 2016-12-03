function getStations( req, res ) {
    res.send( [{ foo: 'bar' } ]);
}

module.exports = { getStations: getStations };