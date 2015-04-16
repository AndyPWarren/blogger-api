'use strict';
var bcrypt = require('bcryptjs');

/**
 * Testing Passport Model
 */
describe('Passport Model', function() {

    var passport = {
        'protocol' : 'local',
        'password' : 'password',
        'user'     : 1
    };

    it('should have correct attributes', function() {

        expect(Passport.attributes).to.have.keys([
            'id',
            'createdAt',
            'updatedAt',
            'protocol',
            'password',
            'provider',
            'identifier',
            'tokens',
            'user',
            'validatePassword'
        ]);

    });

    it('should validate password', function(done) {

        Passport.create(passport)
            .exec(function (err, passport) {
                passport.validatePassword('password', function(err, res) {
                    expect(res).to.equal(true);
                    done();
                });
            });

    });

    it('should hash password before create', function(done) {

        Passport.beforeCreate({ 'password': 'password' }, function(err, res) {
            bcrypt.compare('password', res.password, function(err, res) {
                expect(res).to.equal(true);
                done();
            });
        });

    });

    it('should hash password before update', function(done) {

        Passport.beforeUpdate({ 'password': 'password' }, function(err, res) {
            bcrypt.compare('password', res.password, function(err, res) {
                expect(res).to.equal(true);
                done();
            });
        });

    });

    it('should pass through if password is undefined', function(done) {

        passport.password = undefined;

        Passport.create(passport)
            .exec(function (err, passport) {

                expect(passport.password).to.be.null();
                done();
            });

    });

});
