const mongoose = require('mongoose');

const generateUserId = () => {
    return 'xxxxxxxxx'.replace(/x/g, () => {
        return (Math.random() * 36 | 0).toString(36)
    })
}
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
})
const Exerciseuser = mongoose.model('Exerciseuser', userSchema);

module.exports = {Exerciseuser, generateUserId}
