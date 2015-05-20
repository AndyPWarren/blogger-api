'use strict';

angular.module('bloggerOverlord.dashboard', [

])

.controller('DashboardController', [
    '$scope',
    'SitesResource',
    'splitTime',
    /**
     * @constructor
     * @param   {Object}   $scope        data in controller scope
     * @param   {Factory}  SitesResource resource for interacting with sites endpoint
     * @param   {Function} splitTime     beautify time
     */
    function($scope, SitesResource, splitTime){

        /**
         * unauthorised sites success callback
         * @param   {Object} res sites
         */
        $scope.onGetUnAuthSuccess = function onGetUnAuthSuccess(res) {
            var sites = res.data.sites;
            //set sites variable to be blank
            $scope.allSitesUnauthorized = "";
            /**
             * change the createdAt date/time response from API
             * to something more readable
             * @param {Number} var i=0; i<sites.length; i++
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

            };
            //set a scope variable to contain the sites array
            $scope.unauthorizedSites = sites;
            /**
             * check to see whether sites have been authorized and return message
             * @param   {number}
             * @returns {string}
             */
            if (sites.length === 0) return $scope.allSitesUnauthorized = "All site have been authorised";
        };

        /**
         * unauthorised sites error callback
         * @param   {Object} err server error
         */
        $scope.onGetUnAuthError = function onGetUnAuthError(err) {
            console.log(err);
        };
        /**
         * gets all unauthorized sites
         */
        $scope.getUnauthorizedSites = function(){
            SitesResource.getUnauthorized($scope.onGetUnAuthSuccess, $scope.onGetUnAuthError);
        };
        /**
         * get authorized sites success callback
         * @param   {Object}   res sites
         */
        $scope.onGetAuthSuccess = function onGetAuthSuccess(res) {
            var sites = res.data.sites;
            $scope.allSitesAuthorized = "";

            /**
             * change the createdAt date/time response from API
             * to something more readable
             * @param {Number} var i=0; i<sites.length; i++
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

            };

            $scope.authorizedSites = sites;
            /**
             * check to see whether sites have been authorized and return message
             * @param   {number}
             * @returns {string}
             */
            if (sites.length === 0) return $scope.allSitesAuthorized = "No sites are currently authorised";
        };
        /**
         * authorised sites error callback
         * @param   {Object} err server error
         */
        $scope.onGetAuthError = function onGetAuthError(res) {
            console.log(res);
        };
        /**
         * get all authorized sites
         */
        $scope.getAuthorizedSites = function(){
            SitesResource.getAuthorized($scope.onGetAuthSuccess, $scope.onGetAuthError);
        };

        /**
         * authorize site success callback
         */
        $scope.onAuthorizeSuccess = function onAuthorizeSuccess() {
            $scope.getUnauthorizedSites();
            $scope.getAuthorizedSites();
        };
        /**
         * authorize site error callback
         */
        $scope.onAuthorizeError = function onAuthorizeSuccess(err) {
            console.log(err);
        };

        /**
         * authorize a site by calling SitesResource
         * @param {String} domain sites domain name
         */
        $scope.authorize = function(domain){
            SitesResource.authorize({domain: domain}, $scope.onAuthorizeSuccess, $scope.onAuthorizeError);
        };
        /**
         * un-authorize site success callback
         */
        $scope.onUnauthorizeSuccess = function onUnauthorizeSuccess() {
            $scope.getUnauthorizedSites();
            $scope.getAuthorizedSites();
        };
        /**
         * un-authorize site error callback
         */
        $scope.onUnauthorizeError = function onUnauthorizeSuccess(err) {
            console.log(err);
        };
        /**
         * un-authorize a site by calling SitesResource
         * @param {String} domain sites domain name
         */
        $scope.unauthorize = function(domain){
            SitesResource.unauthorize({domain: domain}, $scope.onUnauthorizeSuccess, $scope.onUnauthorizeError);
        };

    }



]);
