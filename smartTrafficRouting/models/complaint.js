var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    lat: String,
    lon: String,
    username: String,
    status: Number,
    comments: String,
    date: String,

});

var Order = mongoose.model("complaint", orderSchema);


module.exports = Order;