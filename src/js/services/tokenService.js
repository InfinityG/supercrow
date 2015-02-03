/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', '$location', 'config', 'sessionStorageService', 'initializationService'];

    var tokenFactory = function ($http, $window, $location, config, sessionStorageService, initializationService) {

        var serviceBase = config.apiHost, factory = {};

        factory.getToken = function(){
            return sessionStorageService.getAuthToken();
        };

        factory.deleteToken = function(){
            return sessionStorageService.deleteAuthToken();
        };

        factory.login = function(username, password){
            var userData = {username : username, password: password};
            return $http.post(serviceBase + '/tokens', userData, {'withCredentials': 'false'})
                .then(function (response) {
                    var data = response.data;
                    sessionStorageService.saveAuthToken(data.user_id, data.token);
                    //call init on initializationService to set default auth header on http requests
                    initializationService.init();
                    $location.path('/');
                });
            //note: errors handled by httpInterceptor
        };
z
        return factory;
    };

    tokenFactory.$inject = injectParams;

    angular.module('superCrow').factory('tokenService', tokenFactory);

}());