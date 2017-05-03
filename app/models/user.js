var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var user = mongoose.Schema({
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
user.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
//To compare when user login with password
user.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('user',user);