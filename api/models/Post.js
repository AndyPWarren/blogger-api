'use strict';

/**
 * Provides the Post model.
 */
var Post = {
    /**
     * @property attributes
     * @type {Object}
     */
    attributes: {
        title       : {type: 'string', required: true},
        content     : {type: 'string', required: true},
        images      : {collection: 'Image', via: 'post'},
        author      : {model: 'User'},

    },

    /**
    * @property ownerAttribute
    * @type string
    */
    ownerAttribute: 'author',

    /**
    * @property ownerAttribute
    * @type array
    */
    sortBy: ['createdAt']

};

/**
 * @property exports
 * @type {Object}
 */
module.exports = Post;
