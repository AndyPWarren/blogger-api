'use strict';
/**
 * Integration tests for Post resource.
 */
var postFixture = require('../fixtures/Post.json'),
    locales = require('../../config/locales/en.json'),
    authHelper = require('./authHelper.js');

var user = {
    identifier: 'john@smith.com',
    password: 'password'
};


describe('Post Resoruce', function(){

    describe('GET /v1/posts/', function(){

        it('should return an error if no domain is supplied', function(done){

            agent
                .get('/v1/posts')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });

    });

    describe('GET /v1/posts/{domain}', function(){

        it("should return an error if domain doesn't exist", function(done){

            var domain = "test.com";

            agent
                .get('/v1/posts/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });

        it("should return posts if domain exists", function(done){

            var domain = "smith.com";

            agent
                .get('/v1/posts/' + domain)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    if (res.body.data.posts[0].author != postFixture[0].author) return 'Expected Author to equal ' + postFixture[0].author;
                    if (res.body.meta.totalItems != 2) return 'Expected totalItems to equal 2';
                })
                .end(done);
        });

    });

    describe('GET /v1/posts/{domain}/{id}', function(){

        it("should return an error if domain isn't supplied", function(done){

            agent
                .get('/v1/posts/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .expect(function(res){
                    if (res.body.meta.message != locales['Error.Sites.Domain.NotFound']) return 'Expected ' + res.body.meta.message + 'to equal ' + locales['Error.Sites.Domain.NotFound'];
                    })
                .end(done);
        });

        it("should return an error if domain doesn't exist", function(done){

            var domain = "test.com",
                id = 1;

            agent
                .get('/v1/posts/' + domain + '/' + id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .expect(function(res){
                    if (res.body.meta.message != locales['Error.Sites.Domain.NotFound']) return 'Expected ' + res.body.meta.message + 'to equal ' + locales['Error.Sites.Domain.NotFound'];
                })
                .end(done);
        });

        it("should return an error if id doesn't exist in domain", function(done){

            var domain = "smith.com",
                id = 3;

            agent
                .get('/v1/posts/' + domain + '/' + id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end(done);
        });

        it("should return a post if post exists in domain", function(done){

            var domain = "smith.com",
                id = 1;

            agent
                .get('/v1/posts/' + domain + '/' + id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    if (res.body.data.post.id != id) return 'Expected Id to equal ' + id;
                    if (res.body.data.post.author != postFixture[0].author) return 'Expected Author to equal ' +  postFixture[0].author;
                })
                .end(done);
        });


    });

    describe('POST /v1/posts/', function(){

        describe('As user', function(){

            before(function(done){
                authHelper.login(user, done);
            });

            after(function(done){
                authHelper.logout(done);
            });

            it('should create a post', function(done){

                var body = {
                    title: 'A New Post',
                    content: 'Some content'
                };

                agent
                    .post('/v1/posts')
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .expect(function(res){
                    if (res.body.data.post.title != body.title) return 'Expected ' + res.body.data.post.title + ' to equal ' + body.title;
                    if (res.body.data.post.content != body.content) return 'Expected ' + res.body.data.post.content + ' to equal ' + body.content;
                    })
                    .end(done);
            });
        });

        describe('As non-user', function(){

            it('should return an error', function(done){

                var body = {
                    title: 'A New Post',
                    content: 'Some content'
                };

                agent
                    .post('/v1/posts')
                    .send(body)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403)
                    .end(done);


            });

            it('should return new post at top of domain posts', function(done){

                var domain = "smith.com"
                var body = {
                    title: 'A New Post',
                    content: 'Some content'
                };

                agent
                    .get('/v1/posts/' + domain + '?sort=createdAt&order=desc')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(function(res){
                        if (res.body.data.posts[0].title != body.title) return 'Expected ' + res.body.data.posts[0].title + ' to equal' + body.title;
                    })
                    .end(done);


            });

        })

    });
});
