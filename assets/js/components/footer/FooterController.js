'use strict';

angular.module('bloggerOverlord.footer', [

])

.controller('FooterController', [
    '$scope',
    'VersionResource',
    /**
     * @constructor
     * @param {Object}   $scope          controller scope
     * @param {Factory} VersionResource access version of API
     */
    function($scope, VersionResource){

        /**
         * get API version
         * TODO save in local storage
         */
        $scope.apiVersion = function apiVersion(){

            /**
             * success callback
             * @param {Object} res server response
             */
            $scope.onVersionSuccess = function onVersionSuccess(res){
                var version = res.meta.version;
                $scope.apiVersion = version;
            };

            /**
             * error callback
             * @param {Object} err server error response
             */
            $scope.onVersionError = function onVersionError(err){
                console.log(err)
            };

            VersionResource.get($scope.onVersionSuccess, $scope.onVersionError);

        };

    }
])
