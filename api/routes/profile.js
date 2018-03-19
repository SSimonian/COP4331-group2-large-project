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
	new Date().getSeconds()+doc.refreshTime.getSeconds(), new Date().getMilliseconds()+doc.refreshTime.getMilliseconds());
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
