const mongoose = require('mongoose');

// Number of milliseconds within a year = 31556952000

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    last_login: Date,
    public_key: {type: String, required: true},
    freq: {type: Number, default: 31556952000}
});

module.exports = mongoose.model('User', userSchema);