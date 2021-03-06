var express = require('express');
var router = express.Router();
var db = require('../utils/db');
var async = require('async');

/* GET admin listing. */
router.get('/', function(req, res, next) {

	if (!req.session.user || req.session.user.role != 1) {
		return res.redirect('/needLogin');
	}
    async.parallel([
        function(cb) {
            db.get('select count(*) as num from user', function(err, data) {
                cb(null, data['num']);
            });
        },
        function(cb) {
            db.get('select count(*) as count from report', function(err, data) {
                cb(null, data);
            });
        },
        function(cb) {
            db.all('select * from user order by id desc limit 0, 10', function(err, data) {
                cb(null, data);
            });
        },
        function(cb) {
            db.all('select report.id as id, schoolName, userId, entry, (user.email) as email, report.created as created, status from report left join user on report.userId=user.id order by id desc limit 0, 10', function(err, data) {
                console.log(data);
                cb(null, data);
            });
        },
        function(cb) {
            db.all('select * from option', function(err, data) {
                console.log(data);
                cb(null, data);
            });
        }
    ], function(err, results) {
        var data = {};
        data.user = {
            count: results[0],
            lastUsers: results[2]
        };
        data.report = {
            count: results[1].count,
            lastReport: results[3]
        };
        data.option = results[4];
        res.render('admin/overview', { data: data, user: req.session.user});
    });
});

router.post('/option/add', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true, message: "未登陆或没权限"});
	}
    var key = req.body.key;
    var value = req.body.value;

    db.run('insert into option(key, value) values(?,?)', key, value, function(err) {
        if (err) {
          console.log(err);
            res.json({error: true});
        } else {
            req.global[key] = value;
            res.json({error: false});
        }
    });

});

router.post('/option/update', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true, message: "未登陆或没权限"});
	}
    var key = req.body.key;
    var value = req.body.value;
    db.run('update option set value=? where key = ?', value, key, function(err) {
        if (err) {
            res.json({error: true});
        } else {
            req.global[key] = value;
            res.json({error: false});
        }
    });
});

router.post('/option/remove', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true, message: "未登陆或没权限"});
	}
    var key = req.body.key;
    db.run('delete from option where key=?', key, function(err) {
        if (err) {
            res.json({error: true});
        } else {
            delete req.global[key];
            res.json({error: false});
        }
    });
});

router.get('/reportList', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.redirect('/needLogin');
	}
    res.render('admin/reportList', { user: req.session.user, prefix: req.prefix});
});


router.get('/userManage', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.redirect('/needLogin');
	}
    res.render('admin/userManage', { user: req.session.user, prefix: req.prefix});
});

router.get('/article', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.redirect('/needLogin');
	}
    res.render('admin/article', { user: req.session.user, prefix: req.prefix});
});

router.get('/article/:id', function(req, res, next) {
    if (!req.session.user || req.session.user.role != 1) {
	return res.json({error: true, message: "未登陆或没权限"});
    }
    db.get('select * from article where id=?', req.params.id, function(err, data) {
        if (!err) {
            res.json({error: false, result: data});
        } else {
            res.json({ error:true, message: error});
        }
    });
});

router.post('/article/:id', function(req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true});
	}
    var id = req.params.id;
    var title = req.body.title;
    var content = req.body.content;
    db.run('update article set title=?, content=? where id=?', title, content, id, function(err) {
        if (!err) {
            res.json({error: false});
        } else {
            res.json({error: true, message: err});
        }
    });
});

router.get('/:id/forms', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json(401).json({message: "未登陆或没权限"});
	} else {
		db.all('select id, entry, status, created from report where userId=?', req.params.id,  function(err, data) {
            res.json({result: data});
        });
	}
});

router.get('/form/:id', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.redirect('/needLogin');
	} else {
		db.get('select * from report where id = ?', req.params.id,  function(err, data) {
            res.render('admin/simple-form', { data: data});
        });
	}
});


router.post('/form/:id/accept', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json(401).json({message: "未登陆或没权限"});
	} else {
		db.run('update report set status = 2 where id = ?', req.params.id, function(err) {
            if (err) {
                res.status(500).json({ message: err});
            } else {
                res.json({ error: false});
            }
        });
	}
});

router.post('/form/:id/reset', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json(401).json({message: "未登陆或没权限"});
	} else {
		db.run('update report set status = 0 where id = ?', req.params.id, function(err) {
            if (err) {
                res.status(500).json({ message: err});
            } else {
                res.json({ error: false});
            }
        });
	}
});

router.post('/form/:id/submit', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json(401).json({message: "未登陆或没权限"});
	} else {
		db.run('update report set status = 1 where id = ?', req.params.id, function(err) {
            if (err) {
                res.status(500).json({ message: err});
            } else {
                res.json({ error: false});
            }
        });
	}
});


router.post('/form/:id/decline', function (req, res, next) {
	if (!req.session.user || req.session.user.role != 1) {
		return res.json(401).json({message: "未登陆或没权限"});
	} else {
		db.run('update report set status = 3 where id = ?', req.params.id, function(err) {
            if (err) {
                res.status(500).json({ message: err});
            } else {
                res.json({ error: false});
            }
        });
	}
});


module.exports = router;
