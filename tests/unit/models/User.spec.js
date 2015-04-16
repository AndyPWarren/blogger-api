'use strict';
/**
 * Testing User Model
 */

describe('User Model', function() {

    it('should have correct attributes', function() {

        expect(User.attributes).to.have.keys([
            'activated',
            'avatar',
            'createdAt',
            'email',
            'firstName',
            'group',
            'id',
            'issues',
            'lastLoginDate',
            'lastLoginIp',
            'lastName',
            'name',
            'passports',
            'roles',
            'toJSON',
            'updatedAt'
        ]);

    });

    it('should concatenate first and last names and append to user object', function() {

        var mockUser = {
            firstName: 'John',
            lastName: 'Smith',
            name: User.attributes.name,
            toJSON: User.attributes.toJSON,
            toObject: function () {
                return this;
            }
        };

        var name = mockUser.name();

        expect(name).to.equal('John Smith');

        mockUser.toJSON();

        expect(mockUser.fullName).to.equal(name);

    });

    it('should remove passports attribute from object', function() {

        var mockUser = {
            passports: { 'id': '1' },
            name: function() {
                return;
            },
            toJSON: User.attributes.toJSON,
            toObject: function () {
                return this;
            }
        };

        mockUser.toJSON();

        expect(mockUser.passports).to.be.undefined();

    });

    it('should return false if user does not exist in group', function(done) {

        var userId = 1,
            groupId = 2;

        User.isInGroup(userId, groupId).then(function(user){
            expect(user).to.be.false;
            done();
        });
    });

    it('should return true if user exists in group', function(done) {

        var userId = 2,
            groupId = 1;

        User.isInGroup(userId, groupId).then(function(user){
            expect(user).to.be.true;
            done();
        });
    });

});
