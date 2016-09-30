var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = 'http://127.0.0.1:3000';
var async = require('async');

chai.use(chaiHttp);

describe('USER page', () => {

    describe('login && logout: 4 requests', () => {    
        it('Should login successfully', (done) => {
            var agent = chai.request.agent(server);
            async.series([
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@gmail.com',
                            password: '000000'
                        })
                        .then((res) => {
                            res.should.have.status(200);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('error');
                            res.body.error.should.equal(false);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .get('/user/profile')
                        .then((res) => {
                            res.should.have.status(200);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .get('/user/logout')
                        .then((res) => {
                            res.should.have.status(200);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .get('/user/profile')
                        .end((err, res) => {
                            res.should.have.status(401);
                            cb(null);
                        });
                }
            ], done);
        });
    });

    describe('captcha test: 5 requests', () => {    
        it('Should login successfully', (done) => {
            var agent = chai.request.agent(server);
            async.series([
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@163.com',
                            password: '111111'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@163.com',
                            password: '111111'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@163.com',
                            password: '111111'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@163.com',
                            password: '111111'
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.body.message.should.equal('请输入验证码');
                            cb(null);
                        });
                },
                (cb) => {
                    agent
                        .post('/user/login')
                        .send({ 
                            email: 'moevery@163.com',
                            password: '000000',
                            captcha: '  '
                        })
                        .end((err, res) => {
                            res.should.have.status(401);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.message.should.equal('验证码错误');
                            cb(null);
                        });
                },
            ], done);
        });
    });

    describe("register", ()=> {
        it('register a duplicate email', (done) => {
            var agent = chai.request.agent(server);
            async.series([
                (cb) => {
                    agent.post('/user/register')
                        .send({
                            email: 'moevery@gmail.com',
                            password: '00000'
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            cb(null);
                        });
                },
                (cb) => {
                    agent.post('/user/register')
                        .send({
                            email: 'moevery@gmail.com',
                            password: ''
                        })
                        .end((err, res) => {
                            res.should.have.status(400);
                            cb(null);
                        });
                }
            ], done);
        });
    });
});
