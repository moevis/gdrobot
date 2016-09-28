var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.session.user });
});

router.get('/needLogin', function(req, res, next) {
  res.render('needLogin', { user: req.session.user });
});


module.exports = router;
