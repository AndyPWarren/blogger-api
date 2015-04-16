'use strict';
/**
 * Integration tests for Authentication.
 */

describe('Authentication', function() {

    var userFixture = require('../../fixtures/User.json'),
        locales = require('../../../config/locales/en.json');

    /**
     * Local Login
     */
    describe('POST /v1/users/auth/local', function() {

        it('should return error if user does not exist', function(done) {

            var credentials = {
                identifier: 'unknown@user.com',
                password: 'password'
            };

            agent
                .post('/v1/users/auth/local')
                .send(credentials)
                .expect('Content-Type', /json/)
                .expect(200, {
                    'meta': {
                        'errors': locales['Error.Passport.Email.NotFound']
                    }
                }, done);

        });

        it('should authenticate user and save cookie', function(done) {

            var credentials = {
                identifier: userFixture[0].email,
                password: 'password'
            };

            agent
                .post('/v1/users/auth/local')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                    agent.saveCookies(res);
                    done();
                });

        });

    });

    /**
     * Logout
     */
    describe('GET /v1/users/logout', function() {

        it('should logout user', function(done) {

            agent
                .get('/v1/users/logout')
                .expect(200, {
                    'data': {},
                    'meta': {
                        'code': 200,
                        'message': 'logout success',
                        'version': '0.0.2'
                    }
                })
                .end(function (err, res) {
                    agent.saveCookies(res);
                    done();
                });

        });

    });

    /**
     * Local Register
     */
    describe('POST /v1/users/auth/local/register', function() {

        it('should register user', function(done) {

            var body = {
                email: 'new@user.com',
                password: 'password',
                firstName: 'new',
                lastName: 'user',
                group: 1
            };

            agent
                .post('/v1/users/auth/local/register')
                .send(body)
                .expect(200)
                .expect(function(res){
                    if(res.body.data.user.email != body.email) return "missing email";
                    if(res.body.data.user.firstName != body.firstName) return "missing firstName";
                    if(res.body.data.user.lastName != body.lastName) return "missing lastName";
                })
                .end(done);

        });

    });
});
