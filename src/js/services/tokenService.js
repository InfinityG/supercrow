/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$location', '$rootScope', 'config', 'keyService', 'sessionStorageService'];

    var tokenFactory = function ($http, $location, $rootScope, config, keyService, sessionStorageService) {

        var serviceBase = config.apiHost, nacl = config.nacl, factory = {};

        factory.getContext = function () {
            return sessionStorageService.getAuthToken();
        };

        factory.deleteToken = function () {
            return sessionStorageService.deleteAuthToken();
        };

        factory.login = function (username, password) {
            var userData = {username: username, password: password};

            return $http.post(serviceBase + '/tokens', userData, {'withCredentials': 'false'})
                .then(function (response) {
                    var data = response.data;

                    sessionStorageService.saveAuthToken(data.user_id, data.token);
                    var cryptoKey = keyService.generateAESKey(userData.password, nacl);

                    $rootScope.$broadcast('loginEvent', {key: cryptoKey});

                    $location.path('/');
                });
            //note: errors handled by httpInterceptor
        };

        return factory;
    };

    tokenFactory.$inject = injectParams;

    angular.module('superCrow').factory('tokenService', tokenFactory);

}());