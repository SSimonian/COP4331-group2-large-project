var express = require('express');
var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//
//     res.status(200).json("Congratulations!")
// });

/* POST home page. */
router.post('/', function(req, res, next) {
    const user_name = req.body.username;
    const password = req.body.password;

    console.log("User name: " + user_name);
    console.log("Password: " + password);

    res.render('profile');
});

module.exports = router;
