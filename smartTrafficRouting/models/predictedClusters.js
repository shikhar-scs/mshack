var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    lat: String,
    lon: String,
    cluster: Number,

});

var Order = mongoose.model("predictedClusters", orderSchema);


module.exports = Order;