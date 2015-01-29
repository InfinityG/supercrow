/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', '$location', 'config', 'sessionStorageService'];

    var tokenFactory = function ($http, $window, $location, config, sessionStorageService) {

        var serviceBase = config.apiHost, factory = {};

        factory.getToken = function(){
            return sessionStorageService.getAuthToken();
        };

        factory.logout = function(){
            return sessionStorageService.deleteAuthToken();
        };

        factory.login = function(username, password){
            var userData = {username : username, password: password};
            return $http.post(serviceBase + '/tokens', userData, {'withCredentials': 'false'})
                .then(function (response) {
                    var data = response.data;
                    sessionStorageService.saveAuthToken(data.token);
                    $location.path('/');
                },
                function (error) {
                    $window.alert('An error occurred! Status:' + error.status + ', Message:' + JSON.stringify(error.data));
                });
        };

        return factory;
    };

    tokenFactory.$inject = injectParams;

    angular.module('superCrow').factory('tokenService', tokenFactory);

}());