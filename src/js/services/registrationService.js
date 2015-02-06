/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'keyService', 'sessionStorageService'];

    var registrationFactory = function ($http, $rootScope, config, keyService, sessionStorageService) {

        var serviceBase = config.apiHost, nacl = config.nacl, factory = {};

        factory.register = function (firstName, lastName, userName, password) {
            var userData = {first_name: firstName, last_name: lastName, username: userName, password: password};

            return $http.post(serviceBase + '/users', userData, {'withCredentials': 'false'})
                .then(function (response) {
                    var data = response.data;

                    sessionStorageService.saveAuthToken(data.id, data.token);
                    var cryptoKey =  keyService.generateAESKey(userData.password, nacl);

                    $rootScope.$broadcast('contractEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'User successfully registered!'
                    });

                    $rootScope.$broadcast('registrationEvent', {key:cryptoKey});
                });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('superCrow').factory('registrationService', registrationFactory);

}());