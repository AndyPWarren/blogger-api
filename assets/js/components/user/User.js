'use strict';

angular.module('bloggerOverlord.user', [

])


.controller('UserController', ['$scope', '$http', function($scope, $http){

    var getUser = function(email) {
        $http.get('/v1/users/' + email)
        .then(function onSuccess(user){

        })
        .catch(function onError(user){

        })
    };

    $scope.getCurrentUser = function(){
        $http.get('/v1/users/current')
        .then(function onSuccess(res){

            $scope.currentUser = res.data.data.user.fullName;

        })
        .catch(function onError(res){
            $scope.currentUser = "";
        })
    };



    $scope.postUser = function(){

        console.log("posting...")
        $http.post('/v1/users/auth/local', {

            identifier: 'fat@controller.com',
            password: 'password'
        })
        .then(function onSuccess(res){
            window.location = '/';
        })
        .catch(function onError(res){
            console.log('err');
        });
    };
}]);
