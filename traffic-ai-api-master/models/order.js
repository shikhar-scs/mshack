var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    ownerLicense: String,
    items: [{}],
    cust_name: String,
    contact: String,
    totals: Number,
    delivery_time: String,
    status: Number
});

var Order = mongoose.model("order", orderSchema);


module.exports = Order;