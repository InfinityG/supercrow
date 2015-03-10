(function () {

    var injectParams = ['$scope', '$location', '$routeParams', '$window', 'config', 'tokenService', 'keyService', 'cryptoService', 'walletService'];

    var SettingsController = function ($scope, $location, $routeParams, $window, config, tokenService, keyService,
                                       cryptoService, walletService) {

        $scope.currentKeyPair = null;
        $scope.currentWallet = null;
        $scope.password = null;
        $scope.passwordValidated = false;
        $scope.cryptoKey = null;

        function init() {
            var context = tokenService.getContext();

            if (context == null || context == '')
                $location.path('/login');
        }

        $scope.validatePassword = function () {
            var keyPair = keyService.getSigningKeyPair();
            var cryptoKey = keyService.generateAESKey($scope.password, config.nacl);

            if (cryptoService.validateAESKey(cryptoKey, keyPair.sk)) {
                $scope.passwordValidated = true;
                $scope.cryptoKey = cryptoKey;

                $scope.loadDecryptedSigningKeyPair(keyPair);
                $scope.loadDecryptedWallet();
            } else {
                $scope.password = null;
                $scope.passwordValidated = false;
                $scope.cryptoKey = null;
            }
        };

        $scope.regenerateKeyPair = function () {
            //encrypt the secret key and set it back
            var pair = keyService.generateSigningKeyPair();
            var encryptedSecret = cryptoService.encryptString($scope.cryptoKey, pair.sk);

            //save the pair
            keyService.saveSigningKeyPair({pk: pair.pk, sk: encryptedSecret});

            $scope.currentKeyPair = pair;
        };

        $scope.loadDecryptedWallet = function () {
            var wallet = walletService.getWallet();

            if (wallet != null) {
                wallet.secret = cryptoService.decryptString($scope.cryptoKey, wallet.secret);
                $scope.currentWallet = wallet;
            } else {
                $scope.currentWallet = getWalletTemplate();
            }
        };

        $scope.loadDecryptedSigningKeyPair = function (keyPair) {
            keyPair.sk = cryptoService.decryptString($scope.cryptoKey, keyPair.sk);
            $scope.currentKeyPair = keyPair;
        };

        $scope.saveWallet = function () {
            //re-encrypt the secret
            var encryptedSecret = cryptoService.encryptString($scope.cryptoKey, $scope.currentWallet.secret);

            if (encryptedSecret != null) {
                $scope.currentWallet.secret = encryptedSecret;
                walletService.saveWallet($scope.currentWallet);
                $scope.loadDecryptedWallet();
            }
        };

        function getWalletTemplate() {
            return {
                name: null,
                type: 'ripple',
                address: null,
                secret: null
            };
        }

        init();
    };

    SettingsController.$inject = injectParams;

    angular.module('superCrow').controller('SettingsController', SettingsController);

}());