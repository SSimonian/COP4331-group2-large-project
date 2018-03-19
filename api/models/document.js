const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	docName: String,
    content: String,
	expireDate: Date,
	refreshTime : Array
});

module.exports = mongoose.model('Document', documentSchema);