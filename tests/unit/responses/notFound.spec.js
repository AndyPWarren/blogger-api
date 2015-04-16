'use strict';
/**
 * Testing NotFound Response
 */
var response = require('../../../api/responses/notFound.js');

describe('NotFound Response', function() {

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

    it('should set response status to 404', function() {
        response.apply(_this);
        expect(res.status).to.have.been.calledWith(404);
   });

    it('should call ResponseService', function() {

        var message = "Can't find that thing.";
        response.apply(_this, [message]);
        expect(responseService).to.have.been.calledWith(
            req,
            res,
            { meta: { code: 404, errorType: "Response.404", message: message }, model: 'user'}
        );

    });

});
