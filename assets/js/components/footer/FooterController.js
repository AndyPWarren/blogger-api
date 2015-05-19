'use strict';

angular.module('bloggerOverlord.footer', [

])

.controller('FooterController', [
    '$scope',
    'VersionResource',
    'appCache',

    function($scope, VersionResource, appCache){
        $scope.apiVersion = function(){

            $scope.onVersionSuccess = function onVersionSuccess(res){
                console.log(res.meta.version);
                var version = res.meta.version;
                appCache.put('appData', version);
                $scope.apiVersion = appCache.get('appData');
            };

            $scope.onVersionError = function onVersionError(res){

            }

            var cache = appCache.get('appData')
            console.log(cache);
            if (cache) {
                console.log("something in cache");
                $scope.apiVersion = cache
            } else {
                console.log("cache is clear");
                VersionResource.get($scope.onVersionSuccess, $scope.onVersionError)
            }
        };

    }
])
