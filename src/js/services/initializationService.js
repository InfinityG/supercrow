/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', 'sessionStorageService'];

    var configValue = {
        apiHost: 'http://localhost:9000'
    };

    var initializationFactory = function ($http, sessionStorageService) {
        var factory = {};

        factory.init = function(token){
            factory.configureAuth(token);
        };

        factory.configureAuth = function(token){
            // all http requests to the API will have this header
            $http.defaults.headers.common['Authorization'] = token == null ? sessionStorageService.getAuthToken() : token;
            $http.defaults.withCredentials = true;
        };


        return factory;
    };

    initializationFactory.$inject = injectParams;

    angular.module('superCrow').value('config', configValue);
    angular.module('superCrow').factory('initializationService', initializationFactory);

}());