// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(null);

const User = require('../models/user');
const Document = require('../models/document');

/* POST Login Request. */
// If status code 204 is returned, the credentials were not provided.
/*
    JSON Requirements:
        user_name: String
        password: String TODO use bcrypt to hash password -- https://github.com/kelektiv/node.bcrypt.js.

    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99"
    }
*/
router.post('/login', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;

    if (user_name && password) {
        User.findOne({user_name: user_name, password: password})
            .select('-__v')
            .exec()
            .then(function(user) {
                if (user){
                    updateTimes(user);
                    req.userSession.user = user;
                    res.redirect(307, '../profile');
                } else {
                    res.status(204).json({error: "Could not find matching credentials."});
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({error: err});
            });
    } else {
        res.status(204).json({error: "Credentials not provided."});
    }
});

/* POST Request. */
// Inserts User.
/*
    JSON Requirements:
        user_name: String
        password: String TODO use bcrypt to hash password -- https://github.com/kelektiv/node.bcrypt.js.

    Example:
    {
        "user_name": "jane",
        "password": "password",
        "public_key": "janes_public_key"
    }
*/
router.post('/submituser', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;
    const password_repeat = req.body.password_repeat;
    const public_key = req.body.public_key;
    const current_time = new Date();

    if (password !== password_repeat) {
        console.log("Passwords do not match.");
        res.status(204).json({error: "Passwords do not match."});
    } else {
        console.log("this is the time: " + current_time);
        console.log("user_name: " + user_name + " password: " + password + " public_key: " + public_key);

        if (user_name && password && public_key) {
            User.find({ user_name: user_name })
                .exec()
                .then(user => {
                    if (user.length > 0) {
                        return res.status(409).json({
                            message: "user_name already exist"
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            user_name: user_name,
                            password: password,
                            public_key: public_key,
                            last_login: current_time
                        });

                        user.save().then(function(result) {
                            console.log(result);
                            // res.status(201).json({
                            //     createdUser: user
                            // });
                            res.redirect('/login');
                        }).catch(function(err) {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        } else {
            res.status(204).json({error: "Missing user name or password or public key."});
        }
    }


});

/* POST Find Recipient
    Example:
    {
        "user_name": "jacques"
    }
 */
router.post('/findrecipient', function(req, res, next) {
    const user_name = req.body.user_name;

    if (user_name) {
        User.findOne({user_name: user_name})
            .select('-__v')
            .exec()
            .then(function(user) {
                if (user){
                    res.status(200).json({
                       _id: user._id,
                       public_key: user.public_key
                    });
                } else {
                    res.status(204).json({error: "Could not find user_name."});
                }
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({error: err});
            });
    } else {
        res.status(204).json({error: "User_name was not provided"});
    }
});

function updateTimes(user) {
    Document.updateMany({user_id: user._id},
        {$set: {expire_time: +user.frequency + Date.now()}},
        function(err, result) {
            if (err) {
                // Console log is commented out because user's without docs will cause this branch to
                // execute upon sign in.
                // console.log("Error: " + err);
            } else {
                console.log("Document times updated");
            }
        })

}


module.exports = router;