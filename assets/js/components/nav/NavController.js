'use strict';

angular.module('bloggerOverlord.nav', [

])

.controller('NavController', [
    '$scope',
    '$window',
    'UserResource',

    function($scope, $window, UserResource){

        /**
         * on logout success callback
         * @method Logout
         */
        $scope.onLogoutSuccess = function onLogoutSuccess() {
            //point to login page
            $window.location = '/'
        };

        /**
         * on logout error callback
         * @param {object} err server error
         */
        $scope.onLogoutError = function onLogoutError(err) {
            console.log(err);
        };

        /**
         * log out user from UserResource
         * @method logout
         */
        $scope.logout = function logout() {
            UserResource.logout({}, $scope.onLogoutSuccess, $scope.onLogoutError);
        };

        /**
         * current user success callback
         * @param {Object} res user data
         */
        $scope.onCurrentUserSuccess = function onCurrentUserSuccess(res) {
            /**
             * get user from res
             * @param {Object} user
             */
            console.log('on success called')
            var user = res.data.user;
            /**
             * get current user's name
             * @param {string} $scope.currentUser user's full name
             */
            $scope.currentUser = user.fullName;
            /**
             * get last login data
             * @param {String} $scope.lastLoginDate
             */
            $scope.lastLoginDate = user.lastLoginDate;
        };

        /**
         * on error callback no user logged in
         * @param {object} err server error
         */
        $scope.onCurrentUserError = function onCurrentUserError() {
            /**
             * set current user to nothing
             * @param {Object} null
             */
            $scope.currentUser = null;
        };

        /**
         * get current user from UserResource
         * @method current user
         */
        $scope.currentUser = function currentUser() {
            console.log('current user function called')
            UserResource.current($scope.onCurrentUserSuccess, $scope.onCurrentUserError);
//            UserResource.current(function(res){
//                console.log(res.data.user);
//            })
        };

    }
]);

