(function () {

    var injectParams = ['$scope', '$routeParams', '$window', 'localStorageService', 'keyService', 'cryptoService'];

    var SettingsController = function ($scope, $routeParams, $window, localStorageService, keyService, cryptoService) {

        $scope.currentKeyPair = null;
        $scope.currentWallet = null;

        function init() {
            loadData();
        }

        function loadData() {
            $scope.currentKeyPair = localStorageService.getKeyPair();

            var wallet = localStorageService.getWallet();

            if (wallet == null)
                $scope.currentWallet = getWalletTemplate();
            else
                $scope.currentWallet = localStorageService.getWallet();
        }

        function getWalletTemplate() {
            return {
                name: null,
                type: 'ripple',
                address: null,
                secret: null
            };
        }

        $scope.regenerateKeyPair = function () {
            var pair = keyService.generateSigningKeyPair();

            //encrypt the secret key
            var encSecret = cryptoService.encryptString(pair.sk);
            pair.sk = encSecret;

            //save the pair
            localStorageService.saveKeyPair(pair);
            
            $scope.currentKeyPair = pair;
        };

        $scope.saveWallet = function (wallet) {

            try {
                localStorageService.saveWallet(wallet);
                loadData(0);
            } catch (e) {
                $window.alert(e);
            }
        };

        init();
    };

    SettingsController.$inject = injectParams;

    angular.module('superCrow').controller('SettingsController', SettingsController);

}());