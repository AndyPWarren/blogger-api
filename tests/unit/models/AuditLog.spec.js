'use strict';
/**
 * Testing AuditLog Model
 */
describe('AuditLog Model', function() {

    var auditLog;

    beforeEach(function() {

        auditLog = {
            create: sinon.stub(sails.models.auditlog, 'create', function() {
                var promise = {
                    then: function(fn){ fn.apply(this, [{ id: 1 }]); return promise; },
                    catch: function(fn){ fn.apply(this); return promise; }
                };
                return promise;
            }),
            publishCreate: sinon.stub(sails.models.auditlog, 'publishCreate', function() {})
        }

    });

    afterEach(function() {
        sails.models.auditlog.create.restore();
        sails.models.auditlog.publishCreate.restore();
    });

    it('should have correct attributes', function() {

        expect(AuditLog.attributes).to.have.keys([
            'id',
            'createdAt',
            'updatedAt',
            'action',
            'author',
            'group',
            'message',
            'model'
        ]);

    });

    it('should make call to AuditLog.create on AuditLog.log', function() {

        AuditLog.log("update", { id: 1, group: 1 }, "message", "An optional message");

        expect(auditLog.create).to.have.been.calledWith({ action: "update", author: 1, group: 1, model: "message", message: "An optional message" });
        expect(auditLog.publishCreate).to.have.been.calledWith({ id: 1 });

    });

});
