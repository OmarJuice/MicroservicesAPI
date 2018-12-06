const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
})
module.exports = mongoose.model('User', userSchema);
