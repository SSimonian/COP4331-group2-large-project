// Imports and constant members.
const express = require('express');
const router = express.Router(null);

router.get('/', function(req, res, next) {
  res.render('about');
});

module.exports = router;