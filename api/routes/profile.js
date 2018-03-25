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
        res.locals.user = user;
        // render the dashboard page
        res.render('profile');
      }
    });
  } 
    else 
    {
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
    then(doc=>
    {
    doc.expireDate = new Date(new Date().getFullYear()+doc.refreshTime.getFullYear(),
    new Date().getMonth()+doc.refreshTime.getMonth(), new Date().getDate()+doc.refreshTime.getDate(),
    new Date().getHours()+doc.refreshTime.getHours(), new Date().getMinutes()+doc.refreshTime.getMinutes(),
    new Date().getSeconds()+doc.refreshTime.getSeconds());
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
