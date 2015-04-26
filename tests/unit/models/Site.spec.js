'use strict';
/**
 * Testing Site Model
 */

describe('Site Model', function() {

    it('should have correct attributes', function() {

        expect(Site.attributes).to.have.keys([
            'id',
            'users',
            'domain',
            'createdAt',
            'updatedAt'
        ]);

    });
});
