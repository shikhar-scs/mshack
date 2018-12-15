var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    location: String,
    username: String,
    date: String
});

var Order = mongoose.model("binRequest", orderSchema);


module.exports = Order;