const mongoose = require('mongoose');
const downloadSchema = new mongoose.Schema({
    linkURL: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Download = mongoose.model('download', downloadSchema);

module.exports = Download;