'use strict';
/**
 * Integration tests for User resource.
 */

var authHelper = require('../authHelper.js'),
    locales = require('../../../config/locales/en.json');

var member = {
    identifier: 'john@smith.com',
    password: 'password'
};

describe('User Resource as member', function() {

    before(function(done){
        authHelper.login(member, done);
    });

    after(function(done){
        authHelper.logout(done);
    });

    /**
     * Get list of users in group
     */
    describe('GET /v1/users', function() {

        it('should return error if name or email param is not specified', function(done) {

            agent
                .get('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect(function(res){
                if (res.body.meta.message != locales['Error.User.Find.BadRequest']) return 'Expected meta.message to be \"' + locales['Error.User.Find.BadRequest'] + '\"';
            })
                .end(done);

        });

        it('should get users with name containing "john"', function(done) {

            var name = 'John';

            agent
                .get('/v1/users?name=' + name)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.data.users[0].firstName !== name) return 'Expected ' + res.body.data.users[0].firstName + ' to equal ' + name;
            })
                .end(done);

        });

        it('should get users with email containing "john@doe.com"', function(done) {

            var email = 'john@smith.com';

            agent
                .get('/v1/users?email=' + email)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.data.users[0].email !== email) return 'Expected ' + res.body.data.users[0].email + ' to equal ' + email;
            })
                .end(done);

        });

        it('should return sort and pagination meta', function(done) {

            agent
                .get('/v1/users?email=john@doe.com')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.meta.sortBy.length === undefined) return 'No property meta.sortBy';
                var keys = ['totalItems', 'totalPages', 'itemsPerPage', 'currentPage'];
                keys.forEach(function(key){
                    if (!res.body.meta.hasOwnProperty(key)) return "missing pagination meta";
                });
            })
                .end(done);

        });

        it('should return current sort parameter', function(done) {

            agent
                .get('/v1/users?name=john&sort=lastName')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.meta.sorted !== 'lastName') return 'Unexpected sorted: ' + res.body.meta.sorted;
            })
                .end(done);

        });

    });

    /**
     * Get specific user
     */
    describe('GET /v1/users/{id}', function() {

        it('should get individual user', function(done) {

            agent
                .get('/v1/users/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);

        });

        it('should not get user outside group', function(done) {

            agent
                .get('/v1/users/3')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

    /**
     * Get current user
     */
    describe('GET /v1/users/current}', function() {

        it('should get current user', function(done) {

            agent
                .get('/v1/users/current')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.data.user.email !==  member.identifier) return "Unexpected current user.";
            })
                .end(done);

        });

    });

    /**
     * Update User
     */
    describe('PUT /v1/users/{id}', function() {

        it('should update user firstName', function(done) {

            var putUser = {
                "firstName": "Johnathan"
            };

            agent
                .put('/v1/users/1')
                .send(putUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                if (res.body.data.user.firstName !== 'Johnathan') return "User update failed";
            })
                .end(done);

        });

        it('should not update user that is not ourself', function(done) {

            var putUser = {
                "firstName": "Johnathan"
            };

            agent
                .put('/v1/users/2')
                .send(putUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });


});

describe('User Resource as public', function() {

    before(function(done){
        authHelper.logout(done);
    });

    describe('GET /v1/users', function() {

        it('should return 403', function(done) {

            agent
                .get('/v1/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

    describe('GET /v1/users/1', function() {

        it('should return 403', function(done) {

            agent
                .get('/v1/users/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

    describe('GET /v1/users/current', function() {

        it('should return 403', function(done) {

            agent
                .get('/v1/users/current')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

    describe('PUT /v1/users/1', function() {

        it('should return 403', function(done) {

            agent
                .put('/v1/users/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

    describe('DELETE /v1/users/1', function() {

        it('should return 403', function(done) {

            agent
                .delete('/v1/users/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403, done);

        });

    });

});
