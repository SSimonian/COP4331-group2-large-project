// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const Document = require('../models/document');


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
    if (user_name && password) {
        User.findOne({user_name: user_name, password: password})
            .exec()
            .then(function(user) {
                if (user){
                    //res.status(200).json(doc);
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

router.post('/uploadDoc', function(req,res,next) {
	const name = req.body.docName;
	const content = req.body.content;
	var date = new Date(req.body.expYear, req.body.expMonth, req.body.expDate, req.body.expHours, req.body.expMinutes, req.body.expSeconds);
	console.log(date);
	const resetTime = [req.body.expYear-new Date().getFullYear(), req.body.expMonth-new Date().getMonth(), 
								(req.body.expDate-new Date().getDate()), (req.body.expHours-new Date().getHours()),
								(req.body.expMinutes-new Date().getMinutes()), req.body.expSeconds-new Date().getSeconds()];
	const file = new Document({
		_id : new mongoose.Types.ObjectId(),
		docName : name,
		content : content,
		expireDate : date,
		refreshTime : resetTime
	});
	file.save()
	.then(result =>{
		console.log(result);
		res.status(201).json({
			createdDoc : file
		});
	})
	.catch(err=>
	{
		console.log(err);
		res.status(500).json({
			error : err
			
		});
	});
});

router.patch('/updateTimer', function(req, res, next) {
	const docId = req.body.docId;
	const updateTime = req.body.updateTime;
	const date = new Date();
	Document.update({_id : docId}, {$set : {expireDate : new Date(date.getFullYear()+updateTime[0], date.getMonth()+updateTime[1],
	date.getDate()+updateTime[2], date.getHours()+updateTime[3], date.getMinutes()+updateTime[4], date.getSeconds()+updateTime[5])}})
	.exec()
	.then(doc =>{
		console.log(new Date(date.getFullYear()+updateTime[0], date.getMonth()+updateTime[1],
	date.getDate()+updateTime[2], date.getHours()+updateTime[3], date.getMinutes()+updateTime[4], date.getSeconds()+updateTime[5]));
		res.status(200).json(doc);
	})
	.catch(err=> {
		res.status(500).json({
			error: err,
			message: 'it broke'
		})
	});
});





module.exports = router;