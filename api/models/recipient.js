const mongoose = require('mongoose');

const recipientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    password: String,
    pub_key: String,
    userId: String
});

module.exports = mongoose.model('Recipient', recipientSchema);