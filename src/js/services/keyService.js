(function () {
    var injectParams = ['localStorageService', 'cryptoService'];

    var keyFactory = function (localStorageService, cryptoService) {

        var factory = {};

        factory.getSplitWalletSecret = function (wallet) {
            var secret = wallet.secret;
            var result = secrets.share(secrets.str2hex(secret), 2, 2);

            //var str1 = result[0].toString('base64');
            //var str2 = result[1].toString('base64');

            return result;
        };

        factory.generateSigningKeyPair = function () {
            // based on CryptocoinJS (http://cryptocoinjs.com/)
            // using 'require' as these libraries are generated using Browserify and node libraries
            var crypto = require('crypto');
            var ecdsa = require('ecdsa');
            var sr = require('secure-random');
            var CoinKey = require('coinkey');

            var privateKey = sr.randomBuffer(32);
            var ck = new CoinKey(privateKey, true); // true => compressed public key / addresses

            cryptoService.encryptTest();

            return {pk: ck.publicKey.toString('base64'), sk: privateKey.toString('base64')};
        };

        factory.getSigningKeyPair = function(){
          return localStorageService.getKeyPair();
        };

        factory.saveSsPair = function(ssPair){
            localStorageService.saveSsPair(ssPair);
        };

        return factory;
    };

    keyFactory.$inject = injectParams;

    angular.module('superCrow').factory('keyService', keyFactory);

}());