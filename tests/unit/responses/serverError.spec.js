'use strict';
/**
 * Testing ServerError Response
 */
var response = require('../../../api/responses/serverError.js');

describe('ServerError Response', function() {

    var responseService, _this, req = {}, res = {};

    beforeEach(function() {

        res = {
            status: sinon.spy(),
            jsonx: function(){},
            json: function(){}
        };

        req = {
            'options': {
                'model': 'user'
            },
            __: function(translate){
                return translate;
            },
            _sails: {
                config: {
                    environment: "development"
                },
                log: {
                    error: sinon.spy()
                }
            }
        };

        _this = {
            req: req,
            res: res
        };

        responseService = sinon.spy(sails.services.responseservice, 'send');

    });

    afterEach(function() {
        sails.services.responseservice.send.restore();
    });

    it('should set response status to 500', function() {
        response.apply(_this);
        expect(res.status).to.have.been.calledWith(500);
    });

    it('should log error to console', function() {
        var message = "Errors.";
        response.apply(_this, [message]);
        expect(req._sails.log.error).to.have.been.calledWith('Sending 500 ("Server Error") response: \n', message);
    });

    it('should not return error message in production', function() {
        req._sails.config.environment = "production";
        var message = "Errors.";
        response.apply(_this, [message]);
        expect(responseService).to.have.been.calledWith(
            req,
            res,
            { meta: { code: 500, errorType: "Response.500", message: undefined }, model: 'user'}
        );
    });

    it('should call ResponseService', function() {

        var message = "Errors.";
        response.apply(_this, [message]);
        expect(responseService).to.have.been.calledWith(
            req,
            res,
            { meta: { code: 500, errorType: "Response.500", message: message }, model: 'user'}
        );

    });

});
