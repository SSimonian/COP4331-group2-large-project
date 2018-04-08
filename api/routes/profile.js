var express = require('express');
var router = express.Router();
const User = require('../models/user');

 /* GET home page. */
 router.post('/', function(req, res, next) {
  if (req.userSession && req.userSession.user) 
  { 
    User.findOne({_id: req.userSession.user._id }, function (err, user) {
      if (!user) {
        req.userSession.reset();
        res.redirect('/login');
      } else {
        // Create JSON string.
        var json = '{ "_id": "' + user._id + '", "user_name": "' + user.user_name + '", "last_login": ' + user.last_login.getTime() + ' }';
        // Parse JSON string.
        var user_details = JSON.parse(json);

        // Set session to user.
        res.locals.user = user;

        console.log("Profile.js: " + user_details + " stringify: " + JSON.stringify(user_details));
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
/*router.post('/', function(req, res, next) {
    const user_name = req.body.username;
    const password = req.body.password;

    console.log("User name: " + user_name);
    console.log("Password: " + password);

    res.render('profile');
});
*/

router.post('/:documentId', function(req, res, next)
{
    const id = req.params.documentId;
    Document.findById(id).
    exec().
    then( doc=> {
        doc.expireDate = new Date(new Date().getFullYear()+ doc.refreshTime.getFullYear(),
            new Date().getMonth() + doc.refreshTime.getMonth(), new Date().getDate() + doc.refreshTime.getDate(),
            new Date().getHours() + doc.refreshTime.getHours(), new Date().getMinutes() + doc.refreshTime.getMinutes(),
            new Date().getSeconds() + doc.refreshTime.getSeconds());
        console.log(doc);
        res.status(201).json(doc);
    }).
    catch(err => {
        console.log(err);
        res.status(500).json({
            error : err,
            message : 'something broke :('
        });
    });
});


module.exports = router;
