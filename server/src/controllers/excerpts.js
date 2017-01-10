var express = require('express');
var authenticate = require('../middlewares/authenticate');

var Excerpt = require('../models/excerpts');

var router = express.Router();

router.post('/', authenticate, function(req, res) {
  var title = req.body.title;
  var excerpt = req.body.excerpt;

  // Write the excerpt to the database
  Excerpt.forge({
    title  : title,
    excerpt: excerpt,
    ownerId: req.currentUser.attributes.id
  }, { hasTimestamps: true})
    .save(null, { method: 'insert'})
    .then(function(user) {
      res.json({ success: true });
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).json({ error: err });
    });
    
});

module.exports = router;