(function () {
    var injectParams = ['localStorageService'];

    var cryptoFactory = function () {

        var factory = {};

        factory.encryptTest = function(){
            var plainText = 'Yabb()*()*^5£%$£%$^£';
            alert('Plaintext: ' + plainText);

            var cipherText = factory.encryptString(plainText);
            alert('Ciphertext: ' + cipherText);

            var decryptedText = factory.decryptString(cipherText);
            alert('Decrypted plaintext: ' + decryptedText);
        };

        factory.encryptString = function (plainText) {
            var aes = factory.getAESInstance();
            var uaArr = factory.text2ua(plainText);

            //do the encryption
            var cipherText = '';

            //iterate through array and encrypt every block of 4
            for(var i=0; i<uaArr.length; i+=4){
                var block = uaArr.subarray(i,i+4);
                var encBlock = aes.encrypt(block);

                for(var x=0; x<encBlock.length;x++){
                    cipherText += encBlock[x] + ',';
                }
            }

            return cipherText.substring(0, cipherText.length - 1); //remove the last comma
        };

        factory.decryptString = function(cipherText){
            var aes = factory.getAESInstance();
            var arr = cipherText.split(',');

            var result = '';

            //iterate through int array and decrypt every block of 4
            var pos = 0;
            while(pos < arr.length){
                var block = arr.slice(pos, pos+4);
                var decArr = aes.decrypt(block);
                result += factory.ua2text(decArr);
                pos += 4;
            }

            return result;
        };

        factory.getAESInstance = function(){
            //generate a key based on the password and a salt
            var pwd = 'passwd';
            var salt = 'salt';
            var key = factory.getKey(pwd, salt);

            //now use the new key to instantiate AES
            var AES = require('aes');
            return new AES(key);
        };

        factory.text2ua = function(s) {
            //OPTION 1
            //var buf = require('buffer');
            //var bin = buf.Buffer(s);
            //return new Uint32Array(bin, 4);

            //OPTION 2
            //var ua = [];
            //for (var i = 0; i < s.length; i++) {
            //    ua[i] = s.charCodeAt(i);
            //}
            //
            //return ua;

            //OPTION 3
            var ua = new Uint32Array(s.length);
            for (var i = 0; i < s.length; i++) {
                ua[i] = s.charCodeAt(i);
            }

            return ua;
        };

        factory.ua2text = function(ua) {
            var s = '';
            for (var i = 0; i < ua.length; i++) {
                s += String.fromCharCode(ua[i]);
            }
            return s;
        };

        factory.pad = function(hexArr){
            //pad the array of its not divisible by 4
            var arrMod = hexArr.length % 4;
            if(arrMod != 0){
                for(var p=0; p<arrMod; p++){
                    var pad = 0;
                    hexArr.push(pad.toString(16));
                }
            }
            return hexArr;
        };

        factory.getKey = function(password, salt){
            var pbkdf2 = require('pbkdf2-sha256');
            var conv = require('binstring');

            var bin = pbkdf2(password, salt, 1, 8); //use pbkdf2 to convert variable password length to 256 bit hash, split into 8 bytes of 32 bits each
            var hash = conv(bin, {out: 'utf8'});

            //return factory.text2ua(hash);

            var ua = [];
            for (var i = 0; i < hash.length; i++) {
                ua[i] = hash.charCodeAt(i);
            }

            return ua;
        };


        return factory;
    };

    cryptoFactory.$inject = injectParams;

    angular.module('superCrow').factory('cryptoService', cryptoFactory);

}());