/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', 'localStorageService'];

    var walletFactory = function ($http, localStorageService) {

        var factory = {};

        factory.getWallet = function(){
            return localStorageService.getWallet();
        };

        return factory;
    };

    walletFactory.$inject = injectParams;

    angular.module('superCrow').factory('walletService', walletFactory);

}());