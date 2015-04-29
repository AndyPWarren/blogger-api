'use strict';

/**
 * A site represents a customer website which other data can be associated with. \
 * A user must have a membership with a site to enable interaction with blogs.
 *
 * API docs: http://docs.blogger.apiary.io/#reference/site
 * @module SiteController
 */
var fileAdapter = require('skipper-disk')();
var Promise = require('bluebird');

var FileController = {



    uploadImages: function uploadImages(req, res) {

        return req.file('image').upload({
            maxBytes: 1000000
        },function (err, files) {
            if (err) return res.serverError(err);
            console.log(files);
            return File.create({

                imageUrl: require('util').format('%s/files/images/%s', sails.getBaseUrl(), files[i].filename),

                imageFd: files[i].fd,

                title: files[i].filename
            })
            .then(function (file){
                sails.log(file);
                return filesId[i] = file.id;

            })
            .catch(function(err){
                if (err) return res.serverError(err);
            });


            res.json({
                message: files.length + ' file(s) uploaded successfully!',
                files: files
            });

        });
    },

    createFile: function (files){
        var totalFiles = files.length;
        var fileIds = [];
        var promiseFor = Promise.method(function(condition, action, value) {
            if (!condition(value)) return value;
            return action(value).then(promiseFor.bind(null, condition, action));
        });

        return promiseFor(function(count) {
            return count < totalFiles;
        }, function(count) {
            return File.create({
                imageUrl: require('util').format('%s/files/images/%s', sails.getBaseUrl(), files[count].filename),

                imageFd: files[count].fd,

                title: files[count].filename,

                type: files[count].type,

                size: files[count].size,
            })
            .then(function(file) {
                fileIds[count] = file.id;
                console.log(file.id);
                console.log(fileIds);
                if (count === (totalFiles - 1)){
                    var uploadResponse = {
                        data: fileIds,
                        meta: {
                            code: 200,
                            totalFiles: totalFiles
                        }
                    }
                    return uploadResponse;
                } else {
                    return ++count;
                }

            });
        }, 0).then(function(uploadResponse){

            return uploadResponse;
        });


    },

    uploadImagesEach: function(req, res) {

//        req.file('image').upload({
//            maxBytes: 1000000
//        },function (err, files) {
//
//            console.log(files[0].fd);
//            File.createEach(files, {
//                imageUrl: require('util').format('%s/files/images/%s', sails.getBaseUrl(), files.filename),
//
//                imageFd: files.fd,
//
//                title: files.filename
//            }])
//            .exec(function(err, files){
//
//            });
//
//        });


    },

    file: function (req, res){

        req.validate({
            id: 'string'

        });

        File.findOne(req.param('id')).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // Stream the file down
            console.log(file.imageFd);
            fileAdapter.read(file.imageFd)
                .on('error', function (err){
                return res.serverError(req.__('Response.500'));
            })
                .pipe(res);
        });
    }


};


/**
 * @property exports
 * @type {Object}
 */
module.exports = FileController;