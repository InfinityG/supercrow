/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$rootScope', 'tokenService', 'localStorageService'];

    var walletFactory = function ($rootScope, tokenService, localStorageService) {

        var factory = {};

        factory.getWallet = function(){
            var userId = tokenService.getContext().userId;
            return localStorageService.getWallet(userId);
        };

        factory.saveWallet = function(wallet){
            var userId = tokenService.getContext().userId;
            localStorageService.saveWallet(userId, wallet);
        };

        return factory;
    };

    walletFactory.$inject = injectParams;

    angular.module('superCrow').factory('walletService', walletFactory);

}());