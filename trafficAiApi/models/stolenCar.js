var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    ownerLicense: String,
    licensePlate: String
});

var Order = mongoose.model("stolenCars", orderSchema);


module.exports = Order;