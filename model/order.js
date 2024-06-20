const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    
    orderid: {
        type: String
    },
    status: {
        type: String
    },
    paymentid: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }
});

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
