var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var requestedUser = mongoose.Schema({
    id : String,
    firstName : String,
    lastName : String,
    username : String,
    mobile : String,
    categories : [String],
    facebookPage : String,
    instagram : String,
    youtubeChannel : String,
    twitter : String,
    email : String,
    password : String,
});

requestedUser.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
//To compare when user login with password
requestedUser.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('requestedUser',requestedUser);