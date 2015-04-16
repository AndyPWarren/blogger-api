'use strict';
/**
 * Testing BadRequest Response
 */
var response = require('../../../api/responses/badRequest.js');

describe('BadRequest Response', function() {

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

    it('should set response status to 400', function() {
        response.apply(_this);
        expect(res.status).to.have.been.calledWith(400);
   });

    it('should call ResponseService', function() {

        var message = ["Errors."];
        response.apply(_this, [message]);
        expect(responseService).to.have.been.calledWith(
            req,
            res,
            { meta: { code: 400, errorType: "Response.400", errors: message }, model: 'user'}
        );

    });

});
