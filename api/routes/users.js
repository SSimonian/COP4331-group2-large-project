// Imports and constant members.
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router(null);

const User = require('../models/user');
const Document = require('../models/document');

/* POST Login Request. */
// If status code 204 is returned, the credentials were not provided.
/*
    JSON Requirements:
        user_name: String
        password: String
    Example:
    {
        "user_name": "admin",
        "password": "5f4dcc3b5aa765d61d8327deb882cf99"
    }
*/
router.post('/login', function(req, res, next) {
    const user_name = req.body.user_name;
    const password = req.body.password;
    // TODO notify user their credentials were invalid. As of now, the page does not reload and the user must guess they entered invalid creds.
    if (user_name && password) {
        User.findOne({user_name: user_name})
            .select('-__v')
            .exec()
            .then(function(user) {
                if (user){
                    bcrypt.compare(password, user.password, (err, verified) => 
                    {
                        if (err) {
                            console.log(err);
                            res.status(500).json({error: err});
                        } else if (!verified) {
                            res.status(204).json({error: "invalid password."});
                        } else {
                             updateTimes(user);
                             req.userSession.user = user;
                             res.redirect(307, '../profile');
                        }
                    });
                } else {
                    res.status(204).json({error: "Invalid username."});
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

router.post('/login/mobile', function(req, res, next) {
  const user_name = req.body.user_name;
  const password = req.body.password;
  // TODO notify user their credentials were invalid. As of now, the page does not reload and the user must guess they entered invalid creds.
  if (user_name && password) {
    User.findOne({user_name: user_name})
      .select('-__v')
      .exec()
      .then(function(user) {
        if (user){
          bcrypt.compare(password, user.password, (err, verified) =>
          {
            if (err) {
              console.log(err);
              res.status(500).json({error: err});
            } else if (!verified) {
              res.status(204).json({error: "invalid password."});
            } else {
              updateTimes(user);
              res.status(200).json({user_id: user._id, freq: user.freq});
            }
          });
        } else {
          res.status(204).json({error: "Invalid username."});
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
        password: String

    Example:
    {
        "user_name": "jane",
        "password": "password",
        "password_repeat: "password",
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
                        bcrypt.hash(password, null, null, (err, hash)=>
                        {
                            if (err)
                            {
                                return res.status(500).json({
                                  error: err
                                });
                            }
                            const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            user_name: user_name,
                            password: hash,
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

function updateTimes(user_id) {

  if (user_id) {
    User.findOne({_id: user_id})
      .select('-__v')
      .exec()
      .then(function(user) {
        if (user){
          Document.updateMany({user_id: user._id},
            {$set: {expire_time: +user.freq + Date.now()}},
            function(err, result) {
              if (err) {
                console.log("Error: " + err);
              } else {
                console.log("Document times updated");
              }
            })
        }
      }).catch(function(err) {
        console.log(err);
      });
  }



}

/* POST User's details

  While this should be a PATCH method. The form that submits this information does not allow for PATCH methods.
  Therefore, this method accepts a post request.

  Freq must be a number and milliseconds.

    Example:
    {
        "_id": "5aca7930702c110af87fc9d9",
        "user_name": "jane",
        "password": "password",
        "password_repeat": "password",
        "public_key": "janes_public_key",
        "freq": [{
          "years" : 1,
          "months" : 1,
          "days" : 1,
          "hours" : 1
        }]
    }
 */
router.post('/updateprofile', function(req, res, next) {

  const user_id = req.body._id;
  const user_name = req.body.user_name;
  const password = req.body.password;
  const password_repeat = req.body.password_repeat;
  const public_key = req.body.public_key;
  let frequency;
  if (req.body.freq) {
    frequency = req.body.freq[0];
  }
  var itemsProcessed = 0;

  console.log(user_id + "\n" + user_name + "\n" + password + "\n" + password_repeat + "\n" + public_key + "\n" + frequency);

  if (frequency) {
    console.log(frequency.years + "\n" + frequency.months + "\n" + frequency.days + "\n" + frequency.hours);
  }


  if (!user_id) {
    res.status(204).json({error: "Missing user_id."});
  } else {

  if (!user_name)
		itemsProcessed++;
	
	if (!(password === password_repeat && password))
		itemsProcessed++;
	
	if (!public_key)
		itemsProcessed++;
	
	if (!frequency)
		itemsProcessed++;
	
	if (user_name) {
      User.update({_id: user_id},
        {$set: {user_name: user_name }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            console.log("Successfully updated user name.");
          }
		      itemsProcessed++;
		      if(itemsProcessed === 4)
			      res.redirect('/profile/edit');
        });
    }

    if (password === password_repeat && password) {
      bcrypt.hash(password, null,null, (err, hash) => {
          if(err) {
              console.log(err);
              res.status(500).json({error: err})
          } else {
            User.update({_id: user_id},
              {$set: {password: hash }}, function(err, result) {
                if (err) {
                  res.status(500).json({error: err});
                } else {
                  console.log("Successfully updated password.");
                }
                itemsProcessed++;
                if(itemsProcessed === 4)
                  res.redirect('/profile/edit');
              });
          }
      });
    }

    if (public_key) {
      User.update({_id: user_id},
        {$set: {public_key: public_key }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            console.log("Successfully updated public key.");
          }
          itemsProcessed++;
          if(itemsProcessed === 4)
            res.redirect('/profile/edit');
        });
    }

    if (frequency) {
      var millisecs = (frequency.years*31556952000)+(frequency.months*2629746000)+(frequency.days*86400000)+(frequency.hours*3600000);
      User.update({_id: user_id},
        {$set: {freq: millisecs }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            updateTimes(user_id);
            console.log("Successfully updated frequency.");
          }
          itemsProcessed++;
          if(itemsProcessed === 4)
            res.redirect('/profile/edit');
        });
    }

  }
});

router.post('/updateprofile/mobile', function(req, res, next) {

  const user_id = req.body.user_id;
  const user_name = req.body.user_name;
  const password = req.body.password;
  const password_repeat = req.body.password_repeat;
  const public_key = req.body.public_key;
  const frequency = req.body.frequency;
  var itemsProcessed = 0;

  console.log(user_id + "\n" + user_name + "\n" + password + "\n" + password_repeat + "\n" + public_key + "\n" + frequency);

  if (!user_id) {
    res.status(204).json({error: "Missing user_id."});
  } else {

    if (!user_name)
      itemsProcessed++;

    if (!(password === password_repeat && password))
      itemsProcessed++;

    if (!public_key)
      itemsProcessed++;

    if (!frequency)
      itemsProcessed++;

    if (user_name) {
      User.update({_id: user_id},
        {$set: {user_name: user_name }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            console.log("Successfully updated user name.");
          }
          itemsProcessed++;
          if(itemsProcessed === 4)
            res.status(200).json({message: "Successful update."});
        });
    }

    if (password === password_repeat && password) {
      bcrypt.hash(password, null,null, (err, hash) => {
        if(err) {
          console.log(err);
          res.status(500).json({error: err})
        } else {
          User.update({_id: user_id},
            {$set: {password: hash }}, function(err, result) {
              if (err) {
                res.status(500).json({error: err});
              } else {
                console.log("Successfully updated password.");
              }
              itemsProcessed++;
              if(itemsProcessed === 4)
                res.status(200).json({message: "Successful update."});
            });
        }
      });
    }

    if (public_key) {
      User.update({_id: user_id},
        {$set: {public_key: public_key }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            console.log("Successfully updated public key.");
          }
          itemsProcessed++;
          if(itemsProcessed === 4)
            res.status(200).json({message: "Successful update."});
        });
    }

    if (frequency) {
      User.update({_id: user_id},
        {$set: {freq: frequency }}, function(err, result) {
          if (err) {
            res.status(500).json({error: err});
          } else {
            updateTimes(user_id);
            console.log("Successfully updated frequency.");
          }
          itemsProcessed++;
          if(itemsProcessed === 4)
            res.status(200).json({message: "Successful update."});
        });
    }

  }
});

module.exports = router;