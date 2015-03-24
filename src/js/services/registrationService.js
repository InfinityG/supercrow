/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$rootScope', 'config', 'tokenService', 'keyService', 'sessionStorageService'];

    var registrationFactory = function ($http, $rootScope, config, tokenService, keyService, sessionStorageService) {

        var identityBase = config.identityHost, nacl = config.nacl, factory = {};

        factory.register = function (firstName, lastName, userName, password, mobile, role) {

            var registrar = tokenService.getContext().username;

            var userData = {first_name: firstName, last_name: lastName, username: userName, password: password,
                                mobile_number: mobile, confirm_mobile: false, role: role, registrar: registrar};

            return $http.post(identityBase + '/users', userData, {'withCredentials': false})
                .then(function (response) {
                    var data = response.data;

                    sessionStorageService.saveAuthToken(data.id, data.token);
                    var cryptoKey = keyService.generateAESKey(userData.password, nacl);

                    $rootScope.$broadcast('contractEvent', {
                        type: 'Success',
                        status: response.status,
                        message: 'User successfully registered!'
                    });

                    //emit this to be used for encrypting newly generated secret signing keys
                    $rootScope.$broadcast('registrationEvent', {userId: data.id, key: cryptoKey});
                });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('superCrow').factory('registrationService', registrationFactory);

}());