var express = require('express');
var router = express.Router();
var db = require('../utils/db');

/* GET report page. */
router.get('/form', function(req, res, next) {
    res.render('report/form', { user: req.session.user, form: {}});
});

router.get('/:id/form', function(req, res, next) {
    if (!req.session.user) {
        res.redirect("/needLogin");
        return;
    }
    console.log(`select * from report where id=${req.params.id} and userId=${req.session.user.id}`)
    db.get('select * from report where id=? and userId=?', req.params.id, req.session.user.id, function(err, data) {
        console.log(data);
        if (!data) {
            res.redirect('/user/profile');
        } else {
            res.render('report/form', { user: req.session.user, form: data });
        }
    });
});

router.post('/:id/form', function(req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }
    var o = {};
    var schoolName = req.body.schoolName || '';
    var teamName = req.body.teamName || '';
    var entry = req.body.entry || 1;
    var topic = req.body.topic || '';
    var address = req.body.address || '';
    var teachers = req.body.teachers || [];
    var students = req.body.students || [];
    db.get('select * from report where id=? and userId=?', req.params.id, req.session.user.id, function(err, data) {
        if (err || !data) {
            res.json({error:true, message: "无法修改该报告"})
        } else {
            db.run('update report set schoolName=?, teamName=?, entry=?, topic=?, address=?, teachers=?, students=? where id=? and userId=?',
                schoolName,
                teamName,
                entry,
                topic,
                address,
                JSON.stringify(teachers),
                JSON.stringify(students),
                req.params.id,
                req.session.user.id,
                function (err) {
                    if (!err) {
                        res.json({error: false});
                    } else {
                        res.json({error: true, message: err});
                    }
                }
            );
        }
    });

});

router.post('/form', function(req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }
    var o = {};
    var schoolName = req.body.schoolName || '';
    var teamName = req.body.teamName || '';
    var entry = req.body.entry || 1;
    var topic = req.body.topic || '';
    var address = req.body.address || '';
    var teachers = req.body.teachers || [];
    var students = req.body.students || [];
    db.run('insert into report(schoolName, teamName, entry, topic, address, teachers, students, userId) values(?, ?, ?, ?, ?, ?, ?, ?)',
        schoolName,
        teamName,
        entry,
        topic,
        address,
        JSON.stringify(teachers),
        JSON.stringify(students),
        req.session.user.id,
        function (err) {
            if (!err) {
                res.json({error: false});
            } else {
                res.json({error: true, message: err});
            }
        }
    )
});



router.post('/:id/submit', function(req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }
    var currDate = new Date();
    var startDate = new Date(req.global['START_DATE']);
    var endDate = new Date(req.global['END_DATE']);
    console.log(startDate);
    console.log(req.global);
    if (currDate < startDate) {
        return res.json({error: true, message: "还没到提交时间呢，再等等。"});
    } else if (currDate > endDate) {
        return res.json({error: true, message: "已经结束了，期待下次您的参与。"});
    }
    db.get('select * from report where id=? and userId=?', req.params.id, req.session.user.id, function(err, report) {
        if (err || !report) {
            res.json({error:true, message: "无法提交报告"})
        } else {
            if (report.schoolName == '' || report.teamName == '' || report.address == '') {
                return res.json({error: true, message: "还有数据没填，请补充完整再提交"});
            }
            var students = JSON.parse(report.students);
            var teachers = JSON.parse(report.teachers);
            if (!students.length || !teachers.length) {
                return res.json({error: true, message: "参赛的老师和同学还没填完，请检查"});
            }
            db.run('update report set status="1" where id=?', req.params.id, function(error) {
                if (error) {
                    return res.json({error: true, message: error});
                } else {
                    return res.json({error: false});
                }
            });
        }
    });
});

router.post('/:id/delete', function(req, res, next) {
    if (!req.session.user) {
        res.json({error: true, message: "您未登陆，或已经超时退出"});
        return;
    }

    db.get('select * from report where id=? and userId=?', req.params.id, req.session.user.id, function(err, report) {
        if (err || !report) {
            res.json({error:true, message: "无法删除"})
        } else {
            db.run('delete from report where id=?', req.params.id, function(err) {
                if (!err) {
                    res.json({error: false});
                } else {
                    res.josn({error: true, message: "未知错误"});
                }
            });
        }
    });
});


router.get('/search', function (req, res, next) {
	var limit = parseInt(req.query.limit) || 20;
	var offset = parseInt(req.query.offset) || 0;
	var status = req.query.status || 0;
	var date = req.query.date;
	if (!req.session.user || req.session.user.role != 1) {
		return res.json({error: true});
	}

	if (!date) {
		db.all('select * from report where status=? order by id desc limit ?, ?', status, offset, limit, function(err, data) {
			db.get('select count(*) as num from report where status=?', status, function(err, num) {
				res.json({error: false, result: {
					data: data,
					count: num.num
				}});
			});
		});
	} else {
		db.all('select * from report where created > datetime(?, "unixepoch") and status=? order by id desc limit ?, ?', date, status, offset, limit, function(err, data) {
			db.get('select count(*) from report where created > datetime(?, "unixepoch") and status=?', date, status, function(err, num) {
				res.json({error: false, result: {
					data: data,
					count: num.num
				}});
			});
		});
	}
});


module.exports = router;
