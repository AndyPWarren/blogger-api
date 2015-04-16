'use strict';
/**
 * Testing Created Response
 */
var response = require('../../../api/responses/created.js');

describe('Created Response', function() {

    var responseService, _this, req = {}, res = {};

    beforeEach(function() {

        res = {
            status: sinon.spy(),
            jsonx: function(){}
        };

        req = {
            'options': {
                'model': 'user'
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

    it('should set response status to 201', function() {
        response.apply(_this);
        expect(res.status).to.have.been.calledWith(201);
   });

    it('should call ResponseService', function() {

        var createdObject = { title: "some title" };
        response.apply(_this, [createdObject]);
        expect(responseService).to.have.been.calledWith(
            req,
            res,
            { data: createdObject, meta: { code: 201 }, model: 'user'},
            'jsonx'
        );

    });

});
