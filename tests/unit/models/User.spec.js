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
            'site',
            'id',
            'lastLoginDate',
            'lastLoginIp',
            'lastName',
            'name',
            'passports',
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

});
