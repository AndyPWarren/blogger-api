'use strict';

/**
 * A site represents a customer website which other data can be associated with. \
 * A user must have a membership with a site to enable interaction with blogs.
 *
 * API docs: http://docs.blogger.apiary.io/#reference/site
 * @module SiteController
 */
var fileAdapter = require('skipper-disk')();

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
        return File.create({
            imageUrl: require('util').format('%s/files/images/%s', sails.getBaseUrl(), files[0].filename),

            imageFd: files[0].fd,

            title: files[0].filename,

            type: files[0].type,

            size: files[0].size,
        })
        .then(function(file){
            var fileStatus = {
                data: file,
                meta: {
                    code: 200,
                    message: files.length + ' file(s) uploaded successfully!'
                }
            }
//            console.log(fileStatus)
            return fileStatus;
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
