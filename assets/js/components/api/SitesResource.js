'use strict';
/**
 * Factory which provides actions to perform on Sites resource end point
 * @class SitesResource
 **/
angular.module("bloggerOverlord.api.sites", ["ngResource"]).factory("SitesResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param $resource {Service} angular resource service xhr wrapper for REST api's
     * @param ENV {Object} API address'
     **/
    function($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + 'sites',
            {},
            {
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
