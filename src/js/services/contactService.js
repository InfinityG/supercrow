/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', 'config', 'tokenService', 'localStorageService'];

    var contactFactory = function ($http, config, tokenService, localStorageService) {

        var identityBase = config.identityHost, factory = {};

        factory.getContacts= function() {
            var context = tokenService.getContext();
            var username = context.username;
            var userId = context.userId;

            var result = localStorageService.getContacts(userId);

            if (result == null || result.length == 0) {
                result = factory.refreshContacts(userId, username);
            }

            return result;
        };

        factory.refreshContacts = function(userId, username){
            return $http.get(identityBase + '/users/associations/' + username, {'withCredentials': false})
                .then(function (response) {
                    var data = response.data;
                    localStorageService.saveContacts(userId, data);
                    return data;
                });
        };

        return factory;
    };

    contactFactory.$inject = injectParams;

    angular.module('superCrow').factory('contactService', contactFactory);

}());