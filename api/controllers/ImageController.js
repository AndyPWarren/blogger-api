'use strict';

/**
 * A site represents a customer website which other data can be associated with. \
 * A user must have a membership with a site to enable interaction with blogs.
 *
 * API docs: http://docs.blogger.apiary.io/#reference/image
 * @module ImageController
 */
var fileAdapter = require('skipper-disk')();
var promise = require('bluebird');

var S3_KEY = process.env.S3_KEY,
    S3_SECRET = process.env.S3_SECRET,
    S3_BUCKET = process.env.S3_BUCKET;

var ImageController = {

    uploadImages: function uploadImages(req, res) {

        sails.log.debug("uploading...");
        var imageIds = [];
        var promiseFor = promise.method(function(condition, action, value) {
            if (!condition(value)) return value;
            return action(value).then(promiseFor.bind(null, condition, action));
        });
        req.file('image').upload({
            adapter: require('skipper-s3'),
            key: S3_KEY,
            secret: S3_SECRET,
            bucket: S3_BUCKET
        }, function (err, images) {
            promiseFor(function(count) {
                return count < images.length;
            }, function(count) {
                return Image.create({

                    imageUrl: images[count].extra.Location,

                    imageFd: images[count].fd,

                    title: images[count].filename,

                    type: images[count].type,

                    size: images[count].size,
                })
                .then(function(image) {
                    imageIds[count] = image.id;

                    if (count === (images.length - 1)){
                        return imageIds
                     } else {
                        return ++count;
                    }

                });
            }, 0).then(function(imageIds){
                return ResponseService.send(req, res, {
                    data: imageIds,
                    meta: {
                        code: 200,
                        totalImages: images.length
                    }
                });
            });
        });
    }
};


/**
 * @property exports
 * @type {Object}
 */
module.exports = ImageController;
