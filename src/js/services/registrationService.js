/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', '$location', 'config', 'sessionStorageService'];

    var registrationFactory = function ($http, $window, $location, config, sessionStorageService) {

        var serviceBase = config.apiHost, factory = {};

        factory.register = function (firstName, lastName, userName, password) {
            var userData = {first_name: firstName, last_name: lastName, username: userName, password: password};
            return $http.post(serviceBase + '/users', userData, {'withCredentials': 'false'})
                .then(function (response) {
                    var data = response.data;
                    sessionStorageService.saveAuthToken(data.token);

                },
                function (error) {
                    $window.alert('An error occurred! Status:' + error.status + ', Message:' + JSON.stringify(error.data));
                });
        };

        return factory;
    };

    registrationFactory.$inject = injectParams;

    angular.module('superCrow').factory('registrationService', registrationFactory);

}());