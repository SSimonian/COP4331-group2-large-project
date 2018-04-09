var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.userSession && req.userSession.user)
  {
    User.findOne({_id: req.userSession.user._id }, function (err, user) {
      if (!user) {
        req.userSession.reset();
        res.redirect('/login');
      } else {
        // // Create JSON string.
        // var json = '{ "_id": "' + user._id + '", "user_name": "' + user.user_name + '", "last_login": ' + user.last_login.getTime() + ' }';
        // // Parse JSON string.
        // var user_details = JSON.parse(json);
        //
        // // Set session to user.
        // res.locals.user = user;
        //
        // console.log("Profile.js: " + user_details + " stringify: " + JSON.stringify(user_details));
        // render the dashboard page
        res.render('profile', {
          _id: user._id,
          user_name: user.user_name,
          last_login: user.last_login.getTime()
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

 /* POST home page. */
 router.post('/', function(req, res, next) {
  if (req.userSession && req.userSession.user) 
  { 
    User.findOne({_id: req.userSession.user._id }, function (err, user) {
      if (!user) {
        req.userSession.reset();
        res.redirect('/login');
      } else {
        // // Create JSON string.
        // var json = '{ "_id": "' + user._id + '", "user_name": "' + user.user_name + '", "last_login": ' + user.last_login.getTime() + ' }';
        // // Parse JSON string.
        // var user_details = JSON.parse(json);
        //
        // // Set session to user.
        // res.locals.user = user;
        //
        // console.log("Profile.js: " + user_details + " stringify: " + JSON.stringify(user_details));
        // render the dashboard page
        res.render('profile', {
          _id: user._id,
          user_name: user.user_name,
          last_login: user.last_login.getTime()
        });
      }
    });
  } else {
      res.redirect('/login');
  }
 });

 /* GET edit profile page. */
router.get('/edit', function(req, res, next) {
  if (req.userSession && req.userSession.user)
  {
    User.findOne({_id: req.userSession.user._id }, function (err, user) {
      if (!user) {
        req.userSession.reset();
        res.redirect('/login');
      } else {
        // // Create JSON string.
        // var json = '{ "_id": "' + user._id + '", "user_name": "' + user.user_name + '", "last_login": ' + user.last_login.getTime() + ' }';
        // // Parse JSON string.
        // var user_details = JSON.parse(json);
        //
        // // Set session to user.
        // res.locals.user = user;
        //
        // console.log("Profile.js: " + user_details + " stringify: " + JSON.stringify(user_details));
        // render the dashboard page
        res.render('editprofile', {
          _id: user._id,
          user_name: user.user_name,
          last_login: user.last_login.getTime(),
          frequency: user.freq,
          public_key: user.public_key
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

/* GET edit profile page. */
router.get('/submitdoc', function(req, res, next) {
  if (req.userSession && req.userSession.user)
  {
    User.findOne({_id: req.userSession.user._id }, function (err, user) {
      if (!user) {
        req.userSession.reset();
        res.redirect('/login');
      } else {
        // // Create JSON string.
        // var json = '{ "_id": "' + user._id + '", "user_name": "' + user.user_name + '", "last_login": ' + user.last_login.getTime() + ' }';
        // // Parse JSON string.
        // var user_details = JSON.parse(json);
        //
        // // Set session to user.
        // res.locals.user = user;
        //
        // console.log("Profile.js: " + user_details + " stringify: " + JSON.stringify(user_details));
        // render the dashboard page
        res.render('uploaddoc', {
          _id: user._id,
          user_name: user.user_name,
          last_login: user.last_login.getTime(),
          frequency: user.freq,
          public_key: user.public_key
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
