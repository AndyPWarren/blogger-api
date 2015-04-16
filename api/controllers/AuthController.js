'use strict';
/**
 * Provides authentication methods for `/users/auth` endpoint.
 * @module AuthController
 */
var AuthController = {

    /**
     * Log out a user and return them to the homepage
     *
     * Passport exposes a logout() function on req (also aliased as logOut()) that
     * can be called from any route handler which needs to terminate a login
     * session. Invoking logout() will remove the req.user property and clear the
     * login session (if any).
     *
     * For more information on logging out users in Passport.js, check out:
     * http://passportjs.org/guide/logout/
     *
     * @param {Object} req express request data
     * @param {Object} res express response data
     */
    logout: function (req, res) {
        req.logout();
        ResponseService.send(req, res, { meta: { message: 'logout success' }});
    },

    /**
     * Create a third-party authentication endpoint
     *
     * @param {Object} req express request data
     * @param {Object} res express response data
     */
    provider: function (req, res) {
        passport.endpoint(req, res);
    },

    /**
     * Create a authentication callback endpoint
     *
     * This endpoint handles everything related to creating and verifying Pass-
     * ports and users, both locally and from third-aprty providers.
     *
     * Passport exposes a login() function on req (also aliased as logIn()) that
     * can be used to establish a login session. When the login operation
     * completes, user will be assigned to req.user.
     *
     * For more information on logging in users in Passport.js, check out:
     * http://passportjs.org/guide/login/
     *
     * @param {Object} req express request data
     * @param {Object} res express response data
     */
    callback: function (req, res) {
        function tryAgain (err) {

            // Only certain error messages are returned via req.flash('error', someError)
            // because we shouldn't expose internal authorization errors to the user.
            // We do return a generic error and the original request body.
            var flashError = req.flash('error')[0];

            if (err && !flashError) {
                res.json({
                    meta: {
                        errors: req.__('Error.Passport.Generic')
                    }
                });
            } else if (flashError) {
                res.json({
                    meta: {
                        errors: flashError
                    }
                });
            }
        }

        passport.callback(req, res, function (err, user) {
            if (err) {
                return tryAgain();
            }

            req.login(user, function (err) {
                if (err) {
                    return tryAgain();
                } else {
                    // Upon successful login, respond with current user
                    req.session.authenticated = true;
                    sails.log.debug('User: logged in ' + req.user.email);
                    ResponseService.send(req, res, { data: user, model: 'user' });

                    // Update user's last login date
                    var date = new Date();
                    User.update({ id: user.id }, { lastLoginDate: date, lastLoginIp: req.ip })
                        .then(function(user){
                            return user;
                        })
                        .catch(function(err){
                            sails.log.warn(err);
                        });
                }
            });
        });
    },

    /**
     * Disconnect a passport from a user
     *
     * @param {Object} req express request data
     * @param {Object} res express response data
     */
    disconnect: function (req, res) {
        passport.disconnect(req, res);
    }

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = AuthController;
