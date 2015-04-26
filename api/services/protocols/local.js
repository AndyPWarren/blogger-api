'use strict';
var validator = require('validator');

/**
 * Local Authentication Protocol
 *
 * The most widely used way for websites to authenticate users is via a username
 * and/or email as well as a password. This module provides functions both for
 * registering entirely new users, assigning passwords to already registered
 * users and validating login requesting.
 *
 * For more information on local authentication in Passport.js, check out:
 * http://passportjs.org/guide/username-password/
 */

/**
 * Register a new user
 *
 * This method creates a new user from a specified email, username and password
 * and assign the newly created user a local Passport.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.register = function (req, res, next) {
    var email     = req.param('email'),
        password  = req.param('password'),
        firstName = req.param('firstName'),
        lastName  = req.param('lastName'),
        siteId    = req.param('site');


    if (!email) {
        req.flash('error', req.__('Error.Passport.Email.Missing'));
        return next(new Error('No email was entered.'));
    }

    if (!password) {
        req.flash('error', req.__('Error.Passport.Password.Missing'));
        return next(new Error('No password was entered.'));
    }


    if (siteId) {
        Site.siteidSameAsEmail(email, siteId)
            .then(function(site){
                if (site === undefined){
                    req.flash('error', req.__('Error.Passport.Site.NotFound'));
                    return next(new Error("Site doesn't match email domain"));
                } else {
                    User.create({
                        email    : email,
                        firstName: firstName,
                        lastName : lastName,
                        site     : siteId,
                    }, function (err, user) {
                        if (err) {
                            if (err.code === 'E_VALIDATION') {
                                if (err.invalidAttributes.site) {
                                    req.flash('error', req.__('Error.Passport.Site.Missing'));
                                } else {
                                    if (err.invalidAttributes.email) {
                                        req.flash('error', req.__('Error.Passport.Email.Exists'));
                                    } else {
                                        req.flash('error', req.__('Error.Passport.User.Exists'));
                                    }
                                }
                            }

                            return next(err);
                        }

                        Passport.create({
                            protocol : 'local',
                            password : password,
                            user     : user.id
                        }, function (err, passport) {
                            if (err) {
                                if (err.code === 'E_VALIDATION') {
                                    req.flash('error', req.__('Error.Passport.Password.Invalid'));
                                }

                                return user.destroy(function (destroyErr) {
                                    next(destroyErr || err);
                                });
                            }

                            next(null, user);
                        });
                    });
                }

            });
    } else {

        sails.log("error site not supplied");
        req.flash('error', req.__('Error.Passport.Site.Missing'));
        return next(new Error('No site id was supplied.'));

    }



};

/**
 * Assign local Passport to user
 *
 * This function can be used to assign a local Passport to a user who doens't
 * have one already. This would be the case if the user registered using a
 * third-party service and therefore never set a password.
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
exports.connect = function (req, res, next) {
    var user     = req.user,
        password = req.param('password');

    Passport.findOne({
        protocol : 'local',
        user     : user.id
    }, function (err, passport) {
        if (err) {
            return next(err);
        }

        if (!passport) {
            Passport.create({
                protocol : 'local',
                password : password,
                user     : user.id
            }, function (err, passport) {
                next(err, user);
            });
        }
        else {
            next(null, user);
        }
    });
};

/**
 * Validate a login request
 *
 * Looks up a user using the supplied identifier (email or username) and then
 * attempts to find a local Passport associated with the user. If a Passport is
 * found, its password is checked against the password supplied in the form.
 *
 * @param {Object}   req
 * @param {string}   identifier
 * @param {string}   password
 * @param {Function} next
 */
exports.login = function (req, identifier, password, next) {
    var isEmail = validator.isEmail(identifier),
        query   = {};

    if (isEmail) {
        query.email = identifier;
    }
    else {
        query.username = identifier;
    }

    User.findOne(query, function (err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            if (isEmail) {
                req.flash('error', req.__('Error.Passport.Email.NotFound'));
            } else {
                req.flash('error', req.__('Error.Passport.Username.NotFound'));
            }

            return next(null, false);
        }

        Passport.findOne({
            protocol : 'local',
            user     : user.id
        }, function (err, passport) {
            if (passport) {
                passport.validatePassword(password, function (err, res) {
                    if (err) {
                        return next(err);
                    }

                    if (!res) {
                        req.flash('error', req.__('Error.Passport.Password.Wrong'));
                        return next(null, false);
                    } else {
                        return next(null, user);
                    }
                });
            }
            else {
                req.flash('error', req.__('Error.Passport.Password.NotSet'));
                return next(null, false);
            }
        });
    });
};
