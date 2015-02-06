(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'tokenService', 'keyService', 'cryptoService', 'walletService'];

    var SettingsController = function ($scope, $location, $routeParams, $window, tokenService, keyService, cryptoService, walletService) {

        $scope.currentKeyPair = null;
        $scope.currentWallet = null;

        function init() {
            var context = tokenService.getContext();

            if(context == null || context == '')
                $location.path('/login');
            else {
                loadData();
            }
        }

        function loadData() {
            $scope.currentKeyPair = keyService.getSigningKeyPair();
            var wallet = walletService.getWallet();
            $scope.currentWallet = wallet == null ? getWalletTemplate() : wallet;
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
            keyService.saveSigningKeyPair(pair);
            
            $scope.currentKeyPair = pair;
        };

        $scope.saveWallet = function (wallet) {
            try {
                walletService.saveWallet(wallet);
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