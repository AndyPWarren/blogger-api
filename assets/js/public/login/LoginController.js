angular.module('bloggerOverlord.login').controller('LoginController', ['$scope', '$http', function($scope, $http){

    $scope.submitLoginForm = function(){

        var identifier = $scope.loginForm.email.$viewValue;
        var password = $scope.loginForm.password.$viewValue;

        console.log(identifier, password);
        $http.post('/v1/users/auth/local', {

            identifier: identifier,
            password: password

        })
        .then(function onSuccess(res){
            window.location = '/'
        })
        .catch(function onError(res){
            console.log(res);
        });
    };

    $scope.postAdmin = function(){

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

    $scope.postUser = function(){

        console.log("posting...")
        $http.post('/v1/users/auth/local', {

            identifier: 'john@smith.com',
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
