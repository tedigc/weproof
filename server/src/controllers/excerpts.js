var express = require('express');
var authenticate = require('../middlewares/authenticate');

var router = express.Router();

router.post('/', authenticate, function(req, res) {
  console.log(req.currentUser);
  res.status(201).json({ success : true });
});

module.exports = router;