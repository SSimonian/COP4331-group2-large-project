const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: String,
    password: String,
    last_login: Date,
    public_key: String
});

module.exports = mongoose.model('User', userSchema);