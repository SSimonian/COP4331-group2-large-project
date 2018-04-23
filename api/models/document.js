const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nickname: {type: String, required: true},
    ciphertext: {type: String, required: true},
    expire_time: Date,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    renewable: Boolean
});

module.exports = mongoose.model('Document', documentSchema);
