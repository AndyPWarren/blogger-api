'use strict';
/**
 * Authentication helper functions for integration tests.
 * @module {Service} authHelper
 */
module.exports = {

    /**
     * Login request
     * @param   {Object}   credentials login credentials, containing identifier and password
     * @param   {Function} next        callback to execute on login complete
     * @returns {Function} supertest agent
     */
    login: function login(credentials, next) {

        return agent
            .post('/v1/users/auth/local')
            .send(credentials)
            .expect(200)
            .end(function (err, res) {
                agent.saveCookies(res);
                next();
            });

    },

    /**
     * Logout request
     * @param   {Function} next   callback to execute on logout complete
     * @returns {Function} supertest agent
     */
    logout: function logout(next) {

        return agent
            .get('/v1/users/logout')
            .expect(200)
            .end(function (err, res) {
                agent.saveCookies(res);
                next();
            });

    }

}
