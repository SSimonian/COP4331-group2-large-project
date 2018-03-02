// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');

/* POST Login Request. */
// If status code 204 is returned, the credentials were not provided.
/*
    JSON Requirements:
        user_name: String
        password: String -- must be md5 hashed. TODO replace MD5 hash with different hash.

    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99"
    }
*/
router.post('/login', function(req, res, next) {
    const user_name = req.body.username;
    const password = req.body.password;
    console.log("User name: " + user_name);
    console.log("Password: " + password);

    if (user_name && password) {
        User.findOne({user_name: user_name, password: password})
            .exec()
            .then(function(doc) {
                console.log(doc);
                if (doc){
                    // res.status(200).json(doc);
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
        password: String -- must be md5 hashed. TODO replace MD5 hash with different hash.

    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99",
    }
*/
router.post('/submituser', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;

    if (user_name && password) {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            user_name: user_name,
            password: password
        });

        user.save().then(function(result) {
            console.log(result);
            res.status(201).json({
                createdUser: user
            });
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    } else {
        res.status(204).json({error: "Missing user name or password."});
    }
});

module.exports = router;