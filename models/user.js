
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String,
    loggedin: Boolean // needs refactor
})

module.exports = mongoose.model('User', userSchema);