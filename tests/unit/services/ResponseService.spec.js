'use strict';
/**
 * Testing ResponseService
 */
var ResponseService = require('../../../api/services/ResponseService.js'),
    packageJson = require('../../../package.json');

describe('ResponseService', function() {

    beforeEach(function() {

    });

    describe('when we invoke the formatJson method', function() {

        it('should add data to data property of response payload', function() {
            var response = ResponseService.formatJson({
                'data': {
                    'title': 'some title'
                }
            });

            var expectedJson = {
                'data': {
                    'item': {
                        'title': 'some title'
                    }
                },
                'meta': {
                    'version': packageJson.version,
                    'code': 200
                }
            };

            expect(response).to.deep.equal(expectedJson);
        });

        it('should append meta to meta property of response payload', function() {
            var response = ResponseService.formatJson({
                'meta' :{
                    'message': 'some message in the meta'
                }
            });

            var expectedJson = {
                'data': {},
                'meta': {
                    'version': packageJson.version,
                    'code': 200,
                    'message': 'some message in the meta'
                }
            };

            expect(response).to.deep.equal(expectedJson);
        });

        it('should pluralise data key if data is a list', function() {
            var response = ResponseService.formatJson({
                'data': [
                    { 'title': 'first title' },
                    { 'title': 'second title' }
                ]
            });

            var expectedJson = {
                'data': {
                    'items': [
                        { 'title': 'first title' },
                        { 'title': 'second title' }
                    ]
                },
                'meta': {
                    'version': packageJson.version,
                    'code': 200
                }
            };

            expect(response).to.deep.equal(expectedJson);
        });

        it('should assume status code 200 if no meta set', function() {
            var response = ResponseService.formatJson({
                'data': {}
            });

            var expectedJson = {
                'data': {
                    'item': {}
                },
                'meta': {
                    'version': packageJson.version,
                    'code': 200
                }
            };

            expect(response).to.deep.equal(expectedJson);
        });

        it('should set status code from meta.code', function() {
            var response = ResponseService.formatJson({
                'meta': {
                    'code': 404
                }
            });

            var expectedJson = {
                'data': {},
                'meta': {
                    'version': packageJson.version,
                    'code': 404
                }
            };

            expect(response).to.deep.equal(expectedJson);
        });

    });

    describe('when we invoke the send method', function() {

        var req, res, data;

        beforeEach(function() {
            req = {
                'options': {
                    'model': 'user'
                },
                '_sails': {
                    'models': {
                        'user': {
                            '_attributes': {
                                'name': { 'type': 'string' },
                                'id': { 'type': 'string' },
                                'created': { 'type': 'datetime' },
                                'acivated': { 'type': 'boolean' }
                            },
                            'count': function(criteria){
                                var callback = {
                                    then: function(fn){ fn.apply(this, [2]); return callback; },
                                    spread: function(fn){ fn.apply(this); return callback; }
                                };
                                return callback;
                            }
                        }
                    }
                },
                'param': function(paramName) {
                    switch (paramName) {
                        case 'sort':
                            return 'name';
                        case 'order':
                            return 'asc';
                        case 'page':
                            return 1;
                    }
                }
            };

            res = {
                json: sinon.spy(),
                jsonx: sinon.spy(),
                notFound: sinon.spy()
            };

            data = {
                'data': {
                    'name': 'John'
                }
            };

        });

        it('should parse model and call formatJson', function() {

            sinon.spy(ResponseService, 'formatJson');
            ResponseService.send(req, res, data);

            expect(ResponseService.formatJson).to.have.been.calledWith(data);

        });

        it('should manually set model from data.model', function() {

            data.model = 'user';
            ResponseService.send(req, res, data);

            expect(ResponseService.formatJson).to.have.been.calledWith(data);

        });

        it('should make call to res.json', function() {

            ResponseService.send(req, res, data);

            var expectedJson = {
                'data': {
                    'user': {
                        'name': 'John'
                    }
                },
                'meta': {
                    'version': packageJson.version,
                    'code': 200
                }
            };

            expect(res.json).to.have.been.calledWith(expectedJson);
        });

        it('should assign sort params to meta', function() {

            data = {
                'data': [{
                    'name': 'John'
                },{
                    'name': 'Jason'
                }],
                'meta': {
                    'currentPage': 1,
                    'totalPages': 1,
                    'totalItems': 2,
                    'itemsPerPage': 30
                }
            };

            var expectedJson = {
                'data': { 'users': [{ 'name': 'John' }, { 'name': 'Jason' }] },
                'meta': {
                    'currentPage': 1,
                    'totalPages': 1,
                    'totalItems': 2,
                    'itemsPerPage': 30,
                    'code': 200,
                    'order': "asc",
                    'sortBy': ["name", "created"],
                    'sorted': "name",
                    'version': packageJson.version
                }
            };

            ResponseService.send(req, res, data);
            expect(res.json).to.have.been.calledWith(expectedJson);

        });

        it('should respond with not found for page that doesn\'t exist', function() {

            data = {
                'data': [{
                    'name': 'John'
                },{
                    'name': 'Jason'
                }],
                'meta': {
                    'currentPage': 2,
                    'totalPages': 1,
                    'totalItems': 2,
                    'itemsPerPage': 30
                }
            };

            req.param = function(paramName) {
                switch (paramName) {
                    case 'sort':
                        return 'name';
                    case 'order':
                        return 'asc';
                    case 'page':
                        return 2;
                }
            };

            ResponseService.send(req, res, data);
            expect(res.notFound).to.have.been.calledWith('Page 2 doesn\'t exist. There are 1 pages.');

        });

        it('should make call to res.jsonx if type param is set to \'jsonx\'', function() {

            var expectedJson = {
                'data': {
                    'user': {
                        'name': 'John'
                    }
                },
                'meta': {
                    'version': packageJson.version,
                    'code': 200
                }
            };

            ResponseService.send(req, res, data, 'jsonx');

            expect(res.jsonx).to.have.been.calledWith(expectedJson);

        });

    });

    describe('when we invoke the log method', function() {

        var req, res, log;

        beforeEach(function(){

            log = sinon.spy(sails.log, 'debug');

            req = {
                httpVersion: '1.1',
                method: 'GET',
                url: '/v1/users',
                _startTime: 'Tue Jan 20 2015 08:33:58 GMT+0000 (UTC)'
            }

            res = {
                statusCode: 200,
                connection: {
                    bytesRead: 1,
                    bytesWritten: 2
                }
            }



        });

        it('should make call to sails.log', function() {

            ResponseService.log(req, res);

            expect(log).to.have.been.calledWith(
                [req._startTime],
                req.method,
                req.url,
                '=>',
                '1 bytes read',
                '2 bytes written',
                '(HTTP/1.1 200)'
            );

        });

    });

});
