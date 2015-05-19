'use strict';

angular.module('bloggerOverlord.dashboard', [

])

.controller('DashboardController', [
    '$scope',
    'SitesResource',
    'splitTime',
    function($scope, SitesResource, splitTime){
    /**
     * gets all sites that are unauthorized
     * @returns {array}
     */
        $scope.getUnauthorizedSites = function(){

            $scope.onGetUnAuthSuccess = function onGetUnAuthSuccess(res) {
                var sites = res.data.sites;
                $scope.allSitesUnauthorized = "";

                /**
                 * change the createdAt response from API
                 * to something more readable
                 * @param {[[Type]]} var i=0; i<sites.length; i++
                 */
                for (var i=0; i<sites.length; i++) {

                    /**
                     * send createAt string to time splitting function
                     */
                    var newdateTime= splitTime(sites[i].createdAt);
                    /**
                     * remove the createAt string from the site array
                     */
                    delete sites[i].createdAt;
                    /**
                     * add the new date string to the site array
                     */
                    sites[i].createdDate = newdateTime[0];
                    /**
                     * add the new time string to the site array
                     */
                    sites[i].createdTime = newdateTime[1];

                }
                /**
                 * set a scope variable to contain the sites array
                 */
                $scope.unauthorizedSites = sites;
                /**
                 * check to see whether if all sites have
                 * been authorized and return message
                 * @param   {number}
                 * @returns {string}
                 */
                if (sites.length === 0) return $scope.allSitesUnauthorized = "All site have been authorised";
            };

            $scope.onGetUnAuthError = function onGetUnAuthError(res) {
                console.log(res);
            };

            SitesResource.getUnauthorized($scope.onGetUnAuthSuccess, $scope.onGetUnAuthError);

        };

        $scope.getAuthorizedSites = function(){

            $scope.onGetAuthSuccess = function onGetAuthSuccess(res) {
                var sites = res.data.sites;
                $scope.allSitesAuthorized = "";

                for (var i=0; i<sites.length; i++) {
                    var newdateTime= splitTime(sites[i].createdAt);
                    delete sites[i].createdAt;
                    sites[i].createdDate = newdateTime[0];
                    sites[i].createdTime = newdateTime[1];

                }

                $scope.authorizedSites = sites;

                if (sites.length === 0) return $scope.allSitesAuthorized = "No sites are currently authorised";
            };

            $scope.onGetAuthError = function onGetAuthError(res) {
                console.log(res);
            };

            SitesResource.getAuthorized($scope.onGetAuthSuccess, $scope.onGetAuthError)

        };

        $scope.authorize = function(domain){

            $scope.onAuthorizeSuccess = function onAuthorizeSuccess() {
                $scope.getUnauthorizedSites();
                $scope.getAuthorizedSites();
            };

            $scope.onAuthorizeError = function onAuthorizeSuccess(err) {
                console.log(err);
            };


            SitesResource.authorize({domain: domain}, $scope.onAuthorizeSuccess, $scope.onAuthorizeError);

        };

        $scope.unauthorize = function(domain){

            $scope.onUnauthorizeSuccess = function onUnauthorizeSuccess() {
                $scope.getUnauthorizedSites();
                $scope.getAuthorizedSites();
            };

            $scope.onUnauthorizeError = function onUnauthorizeSuccess(err) {
                console.log(err);
            };


            SitesResource.unauthorize({domain: domain}, $scope.onUnauthorizeSuccess, $scope.onUnauthorizeError);
        };

    }



]);
