'use strict';
/**
 * Factory which provides actions to perform on User resource end point
 * @class UserResource
 **/
angular.module("bloggerOverlord.api.user", ["ngResource"]).factory("UserResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param $resource {Service} angular resource service xhr wrapper for REST api's
     **/
    function($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + 'users/:email',
            {},
            {
                get: {
                    method: "GET",
                    cache: false,
                    isArray: false
                },
                current: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "users/current"
                },
                login: {
                    method: "POST",
                    url: ENV.API_ADDRESS + "users/auth/local"
                },
                logout: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "users/logout"
                }
            }

        );
    }
]);
