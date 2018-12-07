const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv').config();
const User = require('./models/exercise');
const URL = require('./models/url');
const exerciseRoutes = require('./routes/exercise-tracker');
const fileRoutes = require('./routes/filemeta');
const timeRoutes = require('./routes/timestamp');
const shortUrlRoutes = require('./routes/shorturl');
const parserRoutes = require('./routes/parser');
const poemRoutes = require('./routes/poem')
const weatherRoutes = require('./routes/weather')





mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
    res.render('index')
})

app.use(exerciseRoutes);
app.use(fileRoutes);
app.use(timeRoutes);
app.use(shortUrlRoutes);
app.use(parserRoutes);
app.use(poemRoutes);
app.use(weatherRoutes);

app.listen(process.env.PORT, function(){
    console.log('Server init')
})
