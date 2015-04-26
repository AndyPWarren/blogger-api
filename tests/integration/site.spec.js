'use strict';
/**
 * Integration tests for Site resource.
 */

describe('Site Resoruce', function(){

    describe('GET /v1/sites/', function(){

        it('should return error if domain is not specified', function(done){

            agent
                .get('/v1/sites')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });

        it('should get sites with domain "smith.com"', function(done){

            var domain = 'smith.com';

            agent
                .get('/v1/sites/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    if (res.body.data.site.domain !== domain) return 'Expected ' + res.body.data.site.domain + ' to equal ' + domain;
                })
                .end(done);
        });

        it('should return an error if site doesnt exist', function(done){

            var domain = 'test.com';

            agent
                .get('/v1/sites/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });
    });
});
