'use strict';

angular.module('bloggerOverlord.dashboard', [

])

.controller('DashboardController', ['$scope', '$http', 'splitTime', function($scope, $http, splitTime){




    /**
     * gets all sites that are unauthorized
     * @returns {array}
     */
    $scope.getUnauthorizedSites = function(){

        $http.get('/v1/sites/unauthorized')
        .then(function onSuccess(res){
            var sites = res.data.data.sites;
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
        })
        .catch(function onError(res){
            console.log(res);
        });

    };

    $scope.getAuthorizedSites = function(){
        $http.get('/v1/sites/authorized')
        .then(function onSuccess(res){

            var sites = res.data.data.sites;
            $scope.allSitesAuthorized = "";

            for (var i=0; i<sites.length; i++) {
                var newdateTime= splitTime(sites[i].createdAt);
                delete sites[i].createdAt;
                sites[i].createdDate = newdateTime[0];
                sites[i].createdTime = newdateTime[1];

            }

            $scope.authorizedSites = sites;

            if (sites.length === 0) return $scope.allSitesAuthorized = "No sites are currently authorised";
        })
        .catch(function onError(res){
            console.log(res);
        });

    };

    $scope.authorize = function(domain){
        var authPath = '/v1/sites/' + domain + '/authorize';

        $http.get(authPath)
        .then(function onSuccess(res){
            $scope.getUnauthorizedSites();
            $scope.getAuthorizedSites();
        })
        .catch(function onError(res){
            console.log(res);
        });
    };

    $scope.unauthorize = function(domain){
        var unauthPath = '/v1/sites/' + domain + '/unauthorize';

        $http.get(unauthPath)
        .then(function onSuccess(res){
            $scope.getAuthorizedSites();
            $scope.getUnauthorizedSites();
        })
        .catch(function onError(res){
            console.log(res);
        });
    }



}])
