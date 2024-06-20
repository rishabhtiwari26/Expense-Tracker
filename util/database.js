const mongoose = require('mongoose');

const connection = async () => {
    try {
        const connection = await mongoose.connect('mongodb+srv://rtiwari0726:xAwEWKupzKaXhvmW@expense-tracker.c29hy8s.mongodb.net/?retryWrites=true&w=majority&appName=Expense-Tracker');
    } catch (er) {
        console.log(er);
    }
}

module.exports = connection