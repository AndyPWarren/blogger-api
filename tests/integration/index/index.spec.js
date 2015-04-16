'use strict';
/**
 * Integration tests for Index
 */

describe('Index', function() {

    describe('GET /v1', function() {

        it('should provide information about the API', function(done) {

            agent
                .get('/v1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    var keys = ['author', 'title', 'description', 'docs', 'homepage', 'license'];

                    keys.forEach(function(key){
                        if (!res.body.meta.hasOwnProperty(key)) return "missing " + key;
                    });
                })
                .end(done);

        });

    });

});
