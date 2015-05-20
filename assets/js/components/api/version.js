'use strict';
/**
 * Factory which provides actions to perform on User resource end point
 * @class UserResource
 **/
angular.module("bloggerOverlord.api.version", ["ngResource"]).factory("VersionResource", [
    "$resource",
    "ENV",
    /**
     * @constructor
     * @param $resource {Service} angular resource service xhr wrapper for REST api's
     **/
    function($resource, ENV) {

        return $resource(
            ENV.API_ADDRESS + 'about'
        );
    }
]);
