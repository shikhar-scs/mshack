var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    licensePlate: String,
    address: String,
    lat: String,
    lon: String,
    timestamp: String
});

var Order = mongoose.model("carSpottings", orderSchema);
module.exports = Order;