'use strict';
/**
 * Factory which provides actions to perform on User resource end point
 * @class UserResource
 **/
angular.module("bloggerOverlord.api.sites", ["ngResource"]).factory("SitesResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param $resource {Service} angular resource service xhr wrapper for REST api's
     **/
    function($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + 'sites',
            {},
            {
                get: {
                    method: "GET",
                    cache: false,
                    isArray: false
                },
                getAuthorized: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "sites/authorized"
                },
                getUnauthorized: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "sites/unauthorized"
                },
                authorize: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "sites/:domain/authorize"
                },
                unauthorize: {
                    method: "GET",
                    url: ENV.API_ADDRESS + "sites/:domain/unauthorize"
                }
            }

        );
    }
]);
