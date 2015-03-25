/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$location', '$rootScope', 'config', 'keyService', 'sessionStorageService'];

    var tokenFactory = function ($http, $location, $rootScope, config, keyService, sessionStorageService) {

        var serviceBase = config.apiHost, identityBase = config.identityHost, nacl = config.nacl, factory = {};

        factory.getContext = function () {
            return sessionStorageService.getAuthToken();
        };

        factory.deleteToken = function () {
            var result = sessionStorageService.deleteAuthToken();
            $rootScope.$broadcast('logoutEvent', {result: result});
            return result;
        };

        factory.login = function (username, password) {
            var userData = {username: username, password: password, domain: 'supercrow'};

            return $http.post(identityBase + '/login', userData, {'withCredentials': false})
                .then(function (response) {
                    var authData = response.data;
                    //var auth = data.auth;
                    //var iv = data.iv;

                    $http.post(serviceBase + '/tokens', authData, {'withCredentials': false})
                        .then(function (response) {
                            var tokenData = response.data;
                            sessionStorageService.saveAuthToken(username, tokenData.external_id, tokenData.external_id,
                                tokenData.role, tokenData.token);
                            var cryptoKey = keyService.generateAESKey(userData.password, nacl);

                            $rootScope.$broadcast('loginEvent', {
                                username: username, userId: tokenData.external_id,
                                role: tokenData.role, key: cryptoKey
                            });
                        });
                });
            //note: errors handled by httpInterceptor
        };

        return factory;
    };

    tokenFactory.$inject = injectParams;

    angular.module('superCrow').factory('tokenService', tokenFactory);

}());