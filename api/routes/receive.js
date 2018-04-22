const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	// res.status(200).json("fuck you again!");
	console.log("Made it");
	return res.render('../views/receive');
})

module.exports = router;