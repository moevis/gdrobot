var express = require('express');
var router = express.Router();
var validate = require('../utils/regex');
var db = require('../utils/db');
var md5 = require('md5');

/* GET users listing. */
router.get('/login', function (req, res, next) {
	res.render('user/login', { user: req.session.user });
});

router.post('/login', function (req, res, next) {
	var email = req.body.email;
	var password = md5(req.body.password);
	db.get('select * from user where email=?', email, function (err, data) {
		if (data && password === data.password) {
			req.session.user = data;
			res.json({error: false});
		} else {
			res.json({error: true, message: "密码或账号错误"});
		}
	});
});

router.get('/logout', function (req, res, next) {
	delete req.session.user;
	res.redirect('/user/login');
});

router.get('/profile', function (req, res, next) {
	if (!req.session.user) {
		res.redirect('/needLogin');
		return;
	}
	res.render('user/profile', { user: req.session.user });
});

router.post('/profile', function (req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }
	var name = req.body.name;
	var phone = req.body.phone;
	db.run('update user set name=?, phone=? where id=?', name, phone, req.session.user.id, function(err) {
		if (!err) {
			db.get('select * from user where id=?', req.session.user.id, function (err, data) {
			 	req.session.user = data;
				res.json({ error: false });
			 });
		} else {
			return res.json({error: true, message: "未知错误"});
		}
	});
});


router.post('/password', function (req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }
	var oldPassword = md5(req.body.password || '');
	if (oldPassword != req.session.user.password) {
		return res.json({error: true, message: "密码错误"});
	}
	if (! req.body.newPassword || !req.body.newPassword.length || req.body.newPassword.length < 6) {
		return res.json({error: true, message: "密码太短，请重新输入。"});
	}
	var password = md5(req.body.newPassword);
	db.run('update user set password=? where id=?', password, req.session.user.id, function(err) {
		if (!err) {
			return res.json({error: false});
		} else {
			return res.json({error: true, message: "未知错误"});
		}
	});
});



router.get('/reportList', function (req, res, next) {
	if (!req.session.user) {
		res.redirect('/needLogin');
	} else {
		db.all('select id, teamName, entry, students, status from report where userId=?',
			req.session.user.id, 
			function(err, data) {
				res.render('user/reportList', { user: req.session.user, reportList: data});
			}
		)
	}
});

router.get('/register', function (req, res, next) {
	res.render('user/register', { user: req.session.user });
});

router.post('/register', function (req, res, next) {
	var email = req.body.email;
	var password = md5(req.body.password);
	db.get('select * from user where email=?', email, function (err, data) {
		if (data) {
			res.json({ error: true, message: "email 已经被使用了" });
		} else {
			db.run('INSERT INTO user(email, password) values(?, ?)', email, password, function(err) {
				if (err) {
					res.json({error: true, message: err});
				} else {
					// db.get('select * from user where email=? and password=? limit 1', email, password, function (err, data) {
					// 	req.session.user = data;
						res.json({ error: false });
					// });
				}
			});
		}
	});
});

router.get('/notice', function (req, res, next) {
	if (!req.session.user) {
		return res.redirect('/needLogin');
	}
	res.render('user/notice', { user: req.session.user });
});

router.get('/search', function (req, res, next) {
	var limit = parseInt(req.query.limit) || 20;
	var offset = parseInt(req.query.offset) || 0;
	var email = req.query.email;
	var date = req.query.date;
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true});
	}

	if (!email && !date) {
		db.all('select * from user order by id desc limit ?, ?', offset, limit, function(err, data) {
			db.get('select count(*) as num from user', function(err, num) {
				res.json({error: false, result: {
					data: data,
					count: num.num
				}});
			});
		});
	} else if (email) {
		db.all('select * from user where email like "?%" order by id desc limit ?, ?', email, offset, limit, function(err, data) {
			db.get('select count(*) as num from user where email like "?%"', function(err, num) {
				res.json({error: false, result: {
					data: data,
					count: num.num
				}});
			});
		});
	} else {
		db.all('select * from user where created > datetime(?, "unixepoch") order by id desc limit ?, ?', date, offset, limit, function(err, data) {
			db.get('select count(*) as num from user where created > datetime(?, "unixepoch")', date, function(err, num) {
				res.json({error: false, result: {
					data: data,
					count: num.num
				}});
			});
		});
	}
});



module.exports = router;
