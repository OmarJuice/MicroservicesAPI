const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv').config();
const fs = require('fs');
const axios = require('axios')
const env = process.env.NODE_ENV || 'development';
let mongouri;
if (env === 'test') {
    mongouri = process.env.MONGO_URI_TEST
} else {
    mongouri = process.env.MONGO_URI
}

const User = require('./models/exercise');
const URL = require('./models/url');
const exerciseRoutes = require('./routes/exercise-tracker');
const fileRoutes = require('./routes/filemeta');
const timeRoutes = require('./routes/timestamp');
const shortUrlRoutes = require('./routes/shorturl');
const parserRoutes = require('./routes/parser');
const poemRoutes = require('./routes/poem')
const weatherRoutes = require('./routes/weather')





mongoose.connect(mongouri, { useNewUrlParser: true }).then(() => { console.log('Connected') }).catch((err) => console.log(err))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use((req, res, next) => {
    if (process.env.DATABASE != 'local') {
        let now = new Date().toString();
        now = now.substr(0, 24)
        let log =
            `-------------------------------------------------------
    ${now}: ${req.method} ${req.url} | PARAMS: ${JSON.stringify(req.params, undefined, 2)} | BODY: ${JSON.stringify(req.body, undefined, 2)}`
        fs.appendFile('server.log', log + '\n', (err) => {
            if (err) {
                console.log(err);
            }
        })
        next();
    } else {
        next()
    }

})

app.get('/', function (req, res) {
    console.log('hi');
    res.render('index')
})

app.use(exerciseRoutes);
app.use(fileRoutes);
app.use(timeRoutes);
app.use(shortUrlRoutes);
app.use(parserRoutes);
app.use(poemRoutes);
app.use(weatherRoutes);

app.get(`/server/log/${process.env.LOG}`, function (req, res) {
    res.sendFile(__dirname + '/server.log')
})

//server pinging
const requestExerciseTracker = setInterval(() => {
    axios.get('https://exercise-tracker-oj.herokuapp.com/')
        .then((res) => {
        })
        .catch((e) => {
            console.log(e);
        })
}, 1440000)
app.listen(process.env.PORT, function () {
    console.log('Server init')
})
module.exports = { app }