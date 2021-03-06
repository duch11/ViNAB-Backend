
const mongoose = require('mongoose');
// to avoid deprication warning
mongoose.set('useFindAndModify', false);

const userSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String,
    loggedin: Boolean // needs refactor
})

module.exports = mongoose.model('User', userSchema);