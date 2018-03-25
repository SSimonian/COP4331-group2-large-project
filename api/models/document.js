const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nickname: String,
    ciphertext: String,
    expire_time: Date,
    user_id: String,
    recipient_id: String
});

module.exports = mongoose.model('Document', documentSchema);