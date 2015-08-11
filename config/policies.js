/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `isAuthenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `isAuthenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


module.exports.policies = {

    // Default policy for all controllers and actions
    // (`true` allows public access)
    // set to false in production
    '*': true,

    '*': [ 'passport' ],

    'UserController': {
        'find': [ 'passport', 'isAuthenticated'],
        'update': [ 'passport', 'isAuthenticated', 'isOwner' ],
        'destroy': [ 'passport', 'isAuthenticated', 'isOwner' ]
    },
    'PostController': {
        'create': [ 'passport', 'isAuthenticated', 'useCurrentUser' ],
        'destroy': [ 'passport', 'isAuthenticated', 'isOwner' ],
        'update': [ 'passport', 'isAuthenticated', 'isOwner' ],
        'getAll': [ 'hasDomain' ],
        'getOne': [ 'hasDomain' ]
    },
    'SiteController': {
        'find': [ 'hasDomain' ],
        'getOne': [ 'hasDomain' ],
        'getAuthorized': [ 'passport', 'isAuthenticated', 'isAdmin' ],
        'getUnauthorized': [ 'passport', 'isAuthenticated', 'isAdmin' ],
        'authorize': [ 'passport', 'isAuthenticated', 'isAdmin' ],
        'unauthorize': [ 'passport', 'isAuthenticated', 'isAdmin' ]
    },
    'ImageController': {
        'uploadImages': ['passport', 'isAuthenticated']
    }


};
