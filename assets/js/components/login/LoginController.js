angular.module('bloggerOverlord.login')

.controller('LoginController', [
    '$scope',
    'UserResource',

    /**
     * @constructor
     * @param   {Object}   $scope       data in controller scope
     * @param   {Factory}  UserResource angular factory for interacting with user API endpoint
     */
    function($scope, UserResource){

        /**
         * submit login form details
         * @returns {string} error message
         */

        $scope.submitLoginForm = function(){

            /**
             * user's email and password from form
             * @name credientials
             * @type {Object}
             */
            var credientials = {
                identifier: $scope.loginForm.email.$viewValue,
                password: $scope.loginForm.password.$viewValue
            };

            /**
             * query API for user with email
             * @param {Object} res user object from resource
             */
            UserResource.get({email: credientials.identifier}, function(res){

                /**
                 * save user from res data
                 * @param {Object} user
                 */
                var user = res.data.user;

                /**
                 * get user's admin status
                 * @param {Boolean} admin
                 */
                var admin = user.admin;

                /**
                 * set userError
                 * @param {Object} null
                 */
                $scope.userError = null;

                /**
                 * if user isn't an admin return error message
                 * @param   {Boolean} admin
                 * @returns {string} $scope.userError
                 */
                if (!admin) return $scope.userError = credientials.identifier + " is not an admin user";

                /**
                 * login user in
                 * @param {Object} credientials
                 */
                UserResource.login(credientials,
                /**
                 * success callback
                 * @param {Object} res
                 */
                function(res){
                    console.log(res);
                    //allow to dashboard
                    window.location = '/dashboard';
                })
            },
            /**
             * error callback if no user is found
             * @param {Object} res error message from UserResource
             */
            function(res){
                /**
                 * user not found
                 * @param {Number} res.status
                 * @returns {String} $scope.userError
                 */
                if (res.status === 404) {
                    return $scope.userError = credientials.identifier + " does not exist";
                }
            });
        };


        /**
         * [[Description]]
         * @param   {[[Type]]} email [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        $scope.postAdmin = function(email){

            var credientials = {
                identifier: email,
                password: 'password'
            };

            UserResource.get({email: credientials.identifier}, function(res){

                var user = res.data.user,
                    admin = user.admin;

                $scope.userError = null;
                if (!admin) return $scope.userError = credientials.identifier + " is not an admin user";

                UserResource.login(credientials, function(res){
                   console.log(res);
                   window.location = '/dashboard';
                })
            }, function(res){
                if (res.status === 404) {
                    $scope.userError = credientials.identifier + " does not exist";
                }
            });

        };

    }
]);
