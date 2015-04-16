'use strict';
/**
 * Testing PaginationUtils
 */
var PaginationUtils = require('../../../api/services/PaginationUtils.js');

describe('PaginationUtils', function() {

    var _sails, req, res;

    beforeEach(function() {
        _sails = {
            'models': {
                'user': {
                    '_attributes': {
                        'title': { 'type': 'string' },
                        'id': { 'type': 'string' },
                        'created': { 'type': 'datetime' },
                        'acivated': { 'type': 'boolean' }
                    },
                    'count': function(criteria){
                        var callback = {
                            then: function(fn){ fn.apply(this, [1]); return callback; },
                            spread: function(fn){ fn.apply(this); return callback; }
                        };
                        return callback;
                    }
                }
            }
        };

        req = {
            'param': function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return 'created';
                    case 'order':
                        return 'asc';
                    case 'page':
                        return 1;
                }
            },
            '_sails': _sails,
            'options': {
                'model': 'user'
            },
            '__': function(input) {
                return input;
            }
        };

        res = {
            badRequest: sinon.spy()
        };
    });

    describe('when we invoke the sortBy method', function() {

        it('should return list of sortable properties', function() {

            var sortMeta = PaginationUtils.sortBy(req);

            expect(sortMeta.sortBy).to.deep.equal(['title','created']);

        });

        it('should set sort and order meta', function() {

            var sortMeta = PaginationUtils.sortBy(req);

            expect(sortMeta.sorted).to.deep.equal(req.param('sort'));
            expect(sortMeta.order).to.deep.equal(req.param('order'));

        });

        it('should set sortBy from model.sortBy if available', function() {

            _sails.models.user.sortBy = ['firstName'];

            var sortMeta = PaginationUtils.sortBy(req);
            expect(sortMeta.sortBy).to.deep.equal(['firstName']);

        });
    });

    describe('when we invoke the validateSort method', function() {

        it('should return formatted sort string if valid', function() {

            var validSort = PaginationUtils.validateSort(req, res);
            expect(validSort).to.equal('created asc');

        });

        it('should return error for invalid sort property', function() {

            req.param = function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return 'firstName';
                    case 'order':
                        return 'asc';
                }
            };

            var validSort = PaginationUtils.validateSort(req, res);
            expect(res.badRequest).to.have.been.calledWith({ sort: 'Error.Pagination.Invalid.Sort' });
            expect(validSort).to.equal(undefined);

        });

        it('should return error for invalid order property', function() {

            req.param = function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return 'created';
                    case 'order':
                        return 'ascending';
                }
            };

            var validSort = PaginationUtils.validateSort(req, res);
            expect(res.badRequest).to.have.been.calledWith({ order: 'Error.Pagination.Invalid.Order' });
            expect(validSort).to.equal(undefined);

        });

        it('should return sort string if valid and no order', function() {

            req.param = function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return 'created';
                    case 'order':
                        return '';
                }
            };

            var validSort = PaginationUtils.validateSort(req, res);
            expect(validSort).to.equal('created');

        });

        it('should return undefined if no sort/order params set', function() {

            req.param = function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return '';
                    case 'order':
                        return '';
                }
            };

            var validSort = PaginationUtils.validateSort(req, res);
            expect(validSort).to.equal(undefined);

        });

    });

    describe('when we invoke the count method', function() {



    });
});
