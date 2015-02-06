/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = [];

    var sessionStorageFactory = function () {

        var factory = {};

        factory.getAuthToken = function(){
            return JSON.parse(sessionStorage.getItem('superCrow.token'));
        };

        factory.saveAuthToken = function(userId, token){
            return sessionStorage.setItem('superCrow.token', JSON.stringify({userId: userId, token: token}));
        };

        factory.deleteAuthToken = function(){
            return sessionStorage.removeItem('superCrow.token');
        };

        return factory;
    };

    sessionStorageFactory.$inject = injectParams;

    angular.module('superCrow').factory('sessionStorageService', sessionStorageFactory);

}());