var express       = require('express');
var validateInput = require('../shared/validations/signup');
var router = express.Router();

router.post('/', function(req, res) {
  var validation = validateInput(req.body);
  if(!validation.isValid) {
    res.status(400).json(validation.errors);
  }
});

module.exports = router;