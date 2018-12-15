var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    lat: String,
    lon: String
});

var Order = mongoose.model("trashCan", orderSchema);


module.exports = Order;