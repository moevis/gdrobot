var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var client = require('../utils/redis');
var svgCaptcha = require('svg-captcha');

/* GET home page. */
router.get('/', function(req, res, next) {
    db.get('select * from article where id=?', 1, function(err, data) {
        res.render('page', { user: req.session.user, page: data, prefix: req.prefix});
    });
});

router.get('/needLogin', function(req, res, next) {
  res.status(401).render('needLogin', { user: req.session.user , prefix: req.prefix});
});

router.get('/captcha', function(req, res, next) {
    req.session.captcha = svgCaptcha.randomText();
    var captcha = svgCaptcha(req.session.captcha);
    res.status(200).send(captcha);
});


module.exports = router;
