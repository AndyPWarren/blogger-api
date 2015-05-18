'use strict';

angular.module('bloggerOverlord.dashboard', [

])

.controller('DashboardController', ['$scope', '$http', function($scope, $http){

    var splitTime = function(time) {
        var timeDateStr = time.split('T'),
            date = timeDateStr[0],
            dateStr= date.split('-'),
            year = dateStr[0],
            month = dateStr[1],
            day = dateStr[2],
            timeStr = timeDateStr[1].split('.'),
            time = timeStr[0];

        var dateDMY = day + '-' + month + '-' + year;
        return [dateDMY, time];

    }

    $scope.getUnauthorizedSites = function(){
        $http.get('/v1/sites/unauthorized')
        .then(function onSuccess(res){
            var sites = res.data.data.sites;
            $scope.allSitesUnauthorized = "";

            for (var i=0; i<sites.length; i++) {
                var newdateTime= splitTime(sites[i].createdAt);
                delete sites[i].createdAt;
                sites[i].createdDate = newdateTime[0];
                sites[i].createdTime = newdateTime[1];

            }
            $scope.unauthorizedSites = sites;
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
