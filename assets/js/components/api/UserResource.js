'use strict';
/**
 * Factory which provides actions to perform on User resource end point
 * @class UserResource
 **/
angular.module("bloggerOverlord.api.user", ["ngResource"]).factory("UserResource", [
    "$resource",
    /**
     * @constructor
     * @param $resource {Service} angular resource service xhr wrapper for REST api's
     **/
    function($resource) {

        return $resource(
            'http://localhost:1337/v1/users/:email',
            {},
            {
                get: {
                    method: "GET",
                    cache: false,
                    isArray: false
                },
                current: {
                    method: "GET",
                    url: "http://localhost:1337/v1/users/current"
                },
                login: {
                    method: "POST",
                    url: "http://localhost:1337/v1/users/auth/local"
                },
                logout: {
                    method: "GET",
                    url: "http://localhost:1337/v1/users/logout"
                }
            }

        );
    }
]);
