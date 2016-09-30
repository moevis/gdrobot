var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app.js');
var should = chai.should();

chai.use(chaiHttp);

describe('USER page', () => {
    describe('login', () => {
        it('Should login successfuly', (done) => {
            chai.request(server)
                .post('/user/login')
                .send({ email: 'moevery@gmail.com', password: '000000'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.equal(false);
                    done();
                });
        });
    });
});
