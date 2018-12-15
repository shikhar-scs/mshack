var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
    username: String,
    password : String,
    email : String,
    name: String,
    phoneNumber: String,
    aadhaar: String,
    license: String,
    address: String,
    OTP: String,
    incentive: Number
});

userSchema.plugin(passportLocalMongoose);


var User = mongoose.model("User", userSchema);


module.exports = User;