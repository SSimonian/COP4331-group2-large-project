// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Document= require('../models/document');

/* POST Request. */
// Inserts Document.
/*
    JSON Requirements:
        nickname: String,
    	ciphertext: String,
    	expire_time: Date,
    	user_id: String,
    	recipient_id: String

    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99",
        "public_key": "test"
    }
*/
router.post('/submitdoc', function(req, res, next) {
    const nickname = req.body.nickname;
    const ciphertext = req.body.ciphertext;
    const recipient_id = req.body.recipient_id;
    const user_id = req.body.user_id;
    // This will change.
    const expire_time = new Date();

    if (nickname && ciphertext && recipient_id && user_id && expire_time) {
        const doc = new Document({
            _id: new mongoose.Types.ObjectId(),
	        nickname: nickname,
    		ciphertext: ciphertext,
    		expire_time: expire_time,
    		user_id: user_id,
    		recipient_id: recipient_id
        });

		doc.save().then(function(result) {
            console.log(result);
            res.status(201).json({
                createdDoc: doc
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    } else {
        res.status(204).json({error: "Missing things."});
    }
});

module.exports = router;