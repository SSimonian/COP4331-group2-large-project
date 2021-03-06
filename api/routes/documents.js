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
                // TODO handle null user!
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
                                createdDocument: document
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
    var pubKeys = [];
    Document.find({recipient_id: req.body.recipient_id})
        .select('-__v')
        .exec()
        .then(docs => {
          console.log("Found recipient");
            const response = {
                count : docs.length,
                documents : docs.map(doc => {
                    if (doc.expire_time.getTime() < Date.now()) {
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
                            nickname: doc.nickname,
                            expire_time: doc.expire_time,
                            user_id: doc.user_id
                        }
                    }
                })
            };
            console.log("Response: " + response.documents[0].user_id);
            
            if (docs) {
                
                let i = 0;
                for (; i < response.count; i++) {
                    console.log("user_id: " + response.documents[i].user_id);
                    var user_id = response.documents[i].user_id;

                    if (user_id) {
                        User.findOne({_id: user_id})
                            .exec()
                            .then(user => {
                                console.log("public_key: " + user.public_key);
                                pubKeys[i-1] = user.public_key;
                                if (i === response.count) {
                                    response.pubKeys = pubKeys;
                                    console.log(response);
                                    res.status(200).json(response);
                                }
                                
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                }
                
            }
            
            
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
  if (req.body.user_id) {
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
  } else {
    res.status(204).json({error: "missing user_id"});
  }
});

router.post('/retrieveText', function (req,res, next) {
    Document.findOne({_id: req.body.docId})
    .exec()
    .then(doc => {
        User.findOne({_id: doc.user_id})
        .exec()
        .then(user =>{
            let Jsonobject = {
            ciphertext: doc.ciphertext,
            uploaderID: user._id,
            uploaderPublicKey: user.public_key
            };
           res.status(200).json(Jsonobject);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
    })
    .catch(err => {
        res.status(500).json({error: err});
    })
}); 

router.post('/viewdoc', function (req,res, next) {
    res.redirect(307, '../receive');
    // res.render('receive', {
    //     docId : req.body.docId
    // });
});

module.exports = router;