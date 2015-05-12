'use strict';
/**
 * Testing Site Model
 */

describe('Site Model', function() {

    var newSite = {
        domain: "test.com",
        users: [1],
        id: 4
    };


    it('should have correct attributes', function() {

        expect(Site.attributes).to.have.keys([
            'id',
            'users',
            'domain',
            'createdAt',
            'updatedAt',
            'authorized'
        ]);

    });

    it('should add authorized field and set to false', function(done) {

        Site.create(newSite).exec(function (err, site) {
            expect(site.authorized).to.be.false();
            done();
        });
    });

    it('should return true if site exists and false if not', function(done) {

        var anotherDomain = "new.com";

        Site.create(newSite).exec(function (err) {
            Site.doesSiteExist(newSite.domain).then(function (site) {
                expect(site).to.be.true();
                Site.doesSiteExist(anotherDomain).then(function (site) {
                    expect(site).to.be.false();
                    done();
                });
            });
        });
    });

    it('should return users in a site', function(done) {

        Site.create(newSite).exec(function (err) {
            Site.usersInSite("test.com").then(function (users) {
                expect(users).to.be.an('array');
                expect(users[0]).to.equal(1);
                done();
            });
        });

    });

    it('should return the site if the email address has the same domain as the site id in a site', function(done) {

        Site.create(newSite).exec(function (err) {
            Site.siteidSameAsEmail("user@test.com", 4).then(function (site) {
                expect(site).to.be.an('object');
                expect(site.id).to.equal(newSite.id);
                done();
            });
        });

    });

    it('should return false if site isnt authorized', function(done) {

        Site.create(newSite).exec(function (err) {
            Site.isSiteAuthorized("test.com").then(function (isAuthorized) {
                expect(isAuthorized).to.be.false();
                done();
            });
        });

    });

});
