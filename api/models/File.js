'use strict';


module.exports  = {

    schema: true,

    /**
     * @property attributes
     * @type {Object}
     */
    attributes: {
        imageUrl    : { type: 'url'},
        imageFd     : { type: 'string'},
        title       : { type: 'string'},
        size        : { type: 'int'},
        type: {
            type: 'string',
            isImage: function(cb) {
                var typeSplit = this.type.split("/");
                return cb(typeSplit[0])
            }
        }
    },
    types: {
        isImage: function(type, typeSplit){
            if (typeSplit === "image"){
                return type;
            }
        }
    }

};



