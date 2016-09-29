var express = require('express');
var router = express.Router();
var db = require('../utils/db');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.get('select * from article where id=?', 1, function(err, data) {
        res.render('page', { user: req.session.user, page: data, prefix: req.prefix});
    });
});

router.get('/needLogin', function(req, res, next) {
  res.render('needLogin', { user: req.session.user , prefix: req.prefix});
});


module.exports = router;
