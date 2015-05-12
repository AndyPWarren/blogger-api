'use strict';
/**
 * Integration tests for Site resource.
 */

var authHelper = require('./authHelper.js');

var overload = {
    identifier: 'fat@controller.com',
    password: 'password'
};

describe('Site Resource', function(){



    describe('GET /v1/sites/', function(){

        describe('not as site admin', function(){

            it('should return an error if overload isnt logged in', function(done){

                agent
                    .get('/v1/sites')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(done);
            });

        });

        describe('as site admin/overload', function(){

            before(function(done){
                authHelper.login(overload, done);
            });

            after(function(done){
                authHelper.logout(done);
            });

            it('should return un-authorized sites', function(done){

                agent
                    .get('/v1/sites')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        expect(res.body.data.sites).to.be.an('array');
                        expect(res.body.data.sites[0].authorized).to.be.false();
                    })
                    .end(done);
            });

        });

    });

    describe('GET /v1/sites/:domain/authorize', function(){

        describe('not as site admin', function(){

            it('should return an error if overload isnt logged in', function(done){

                agent
                    .get('/v1/sites/smith.com/authorize')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(done);
            });

        });

        describe('as site admin/overload', function(){

            before(function(done){
                authHelper.login(overload, done);
            });

            after(function(done){
                authHelper.logout(done);
            });

            it('should authorize the site', function(done){

                agent
                    .get('/v1/sites/smith.com/authorize')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                    expect(res.body.data.sites[0].authorized).to.be.true();
                })
                    .end(done);
            });

        });

    });

    describe('GET /v1/sites/:domain', function() {

        it('should return a 404 error if site doesnt exist', function(done){

            var domain = 'test.com';

            agent
                .get('/v1/sites/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });

        it('should return a 403 error if site is un-authorized', function(done){

            var domain = 'bloggs.co.uk';

            agent
                .get('/v1/sites/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403)
                .end(done);
        });

        it('should get sites that are authorized', function(done){

            var domain = 'smith.com';

            agent
                .get('/v1/sites/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    expect(res.body.data.site.authorized).to.be.true();
                })
                .end(done);
        });


    });
});
