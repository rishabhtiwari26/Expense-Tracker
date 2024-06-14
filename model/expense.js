const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    expenseAmount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;


