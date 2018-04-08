// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Document = require('../models/document');
const User = require('../models/user');

/* POST Submit Document
    Example:
    {
        "nickname": "test document",
        "ciphertext": "cipher text",
        "user_id": "5aca6595a0127e17205edd2f",
        "recipient_id": "5aca61b010c87533a875ba5c"
    }
 */
router.post('/submitdoc', function(req, res, next) {
    const nickname = req.body.nickname;
    const ciphertext = req.body.ciphertext;
    const recipient_id = req.body.recipient_id;
    const user_id = req.body.user_id;

    if (nickname && ciphertext && recipient_id && user_id) {
        User.findOne({_id: user_id})
            .exec()
            .then(user => {
                // Obtain user's frequency and set time
                var frequency = user.freq;
                var expire_time = new Date();
                expire_time.setTime(+expire_time.getTime() + frequency);
                console.log("After setting time:\n" + expire_time + '\n' + Date.now());

                User.findOne({_id: recipient_id})
                    .exec()
                    .then(user => {
                        // User found, so create document.
                        const document = new Document({
                            _id: new mongoose.Types.ObjectId(),
                            nickname: nickname,
                            ciphertext: ciphertext,
                            expire_time: expire_time,
                            user_id: user_id,
                            recipient_id: recipient_id
                        });

                        document.save().then(function(result) {
                            console.log(result);
                            res.status(201).json({
                                createdRelationship: document
                            });
                        }).catch(function(err) {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    } else {
        res.status(204).json({error: "Missing things."});
    }
});

router.get('/:user_id', function(req, res, next) {
    console.log(req.params.user_id);
    Document.find({user_id: req.params.user_id})
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                products : docs
            };
            res.status(200).json(response);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// router.post('/fetchdocs', function(req, res, next) {
//     console.log(req.body.user_id);
//     Document.find({user_id: req.body.user_id})
//         .select('-__v')
//         .exec()
//         .then(docs => {
//             const response = {
//                 count : docs.length,
//                 documents : docs
//             };
//             res.status(200).json(response);
//         })
//         .catch(function(err) {
//             console.log(err);
//             res.status(500).json({error: err});
//         });
// });


/* POST Fetch Recipient Docs
    Example:
    {
        "recipient_id": "5aca61b010c87533a875ba5c"
    }
 */
router.post('/fetchrecipientdocs', function(req, res, next) {
    Document.find({recipient_id: req.body.recipient_id})
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                documents : docs.map(doc => {
                    if (doc.expire_time.getTime() < Date.now()) {
                        //console.log(doc.expire_time.getTime() + '\n' + Date.now());
                        return {
                            _id: doc._id,
                            nickname: doc.nickname,
                            ciphertext: doc.ciphertext,
                            expire_time: doc.expire_time,
                            user_id: doc.user_id,
                            recipient_id: doc.recipient_id
                        }
                    } else {
                        // TODO decide if this is worth doing. Not returning an object will map "null" into the collection.
                        return {
                            _id: doc._id,
                            nickname: doc.nickname
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });
});

/* POST Fetch User Docs
    Example:
    {
	    "user_id": "5aca6595a0127e17205edd2f"
    }
 */
router.post('/fetchuserdocs', function(req, res, next) {
    Document.find({user_id: req.body.user_id})
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                documents : docs.map(doc => {
                        return {
                            _id: doc._id,
                            nickname: doc.nickname,
                            ciphertext: doc.ciphertext,
                            expire_time: doc.expire_time,
                            user_id: doc.user_id,
                            recipient_id: doc.recipient_id
                        }
                })
            };
            res.status(200).json(response);
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router;