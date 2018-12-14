const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
    res.render('index')
})
router.get('/weather', function (req, res) {
    res.render('weather')
})

const getWeather = (location) => {

    return new Promise((resolve, reject) => {
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.MAPBOX_KEY}`)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Mapbox server error')
                }
                if (response.data.features.length === 0) {
                    throw new Error('Location not found')
                }
                let loc = {
                    latitude: response.data.features[0].geometry.coordinates[1],
                    longitude: response.data.features[0].geometry.coordinates[0],
                }
                return axios.get(`https://api.darksky.net/forecast/${process.env.DARK_SKY_KEY}/${loc.latitude},${loc.longitude}`)
            })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('DarkSky server error')
                }
                resolve(res.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

router.get('/api/weather/:location', function (req, res) {
    let location = req.params.location;
    getWeather(location)
        .then((result) => {
            res.json({ result, location })
        })
        .catch((error) => {
            res.status(404).send(error.message)
        })
})


module.exports = router;
