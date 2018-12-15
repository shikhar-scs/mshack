var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    lat: String,
    lon: String,
    recyclable: Number,
    nonRecyclable: Number,
    username: String,
    status: Number,
    comments: String,
    date: String,

});

var Order = mongoose.model("pickup", orderSchema);


module.exports = Order;