"use strict";

var bloggerOverlord = angular.module('bloggerOverlord', [
    "bloggerOverlord.api",
    "bloggerOverlord.login",
    "bloggerOverlord.user",
    "bloggerOverlord.dashboard",
    "bloggerOverlord.nav"
])
.controller('appController', ['$scope', '$http', function($scope, $http){

    $scope.apiVersion = function(){
        $http.get('/v1/about')
            .then(function onSuccess(res){
            $scope.version = res.data.meta.version;
        })
            .catch(function onError(sailsResponse){
            console.log('err');
        });
    };

}]);
