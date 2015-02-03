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

        factory.init = function(){
            factory.configureAuth();
        };

        factory.configureAuth = function(){
            // all http requests to the API will have this header
            var token = sessionStorageService.getAuthToken();
            if(token != null) {
                $http.defaults.headers.common['Authorization'] = token.token;
                $http.defaults.withCredentials = true;
            }
        };

        return factory;
    };

    initializationFactory.$inject = injectParams;

    angular.module('superCrow').value('config', configValue);
    angular.module('superCrow').factory('initializationService', initializationFactory);

}());