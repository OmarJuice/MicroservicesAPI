const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    "original": String,
    "shortened": Number
})


module.exports = mongoose.model('Url', urlSchema)