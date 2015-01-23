(function () {

    var injectParams = [];

    var localStorageFactory = function () {

        var factory = {};

        /*
         CONTRACTS
         */

        factory.getContracts = function () {
            var result = JSON.parse(localStorage.getItem('superCrow.contracts'));

            if (result == null)
                result = [];

            result.sort(function (a, b) {
                return a.external_id - b.external_id;
            });

            return result;
        };

        factory.saveContract = function (contract) {
            var contracts = factory.getContracts();

            //this has been sent to the API and we have received an id
            //re-save with updated information from the API
            if (contract.id != null && contract.id != '') {
                for (var i = 0; i < contracts.length; i++) {
                    if (contracts[i].external_id == contract.external_id) {
                        contracts.splice(i, 1);
                        contracts.push(contract);
                        localStorage.removeItem('superCrow.contracts');
                        localStorage.setItem('superCrow.contracts', JSON.stringify(contracts));
                    }
                }
                return;
            }

            //check that a contract with the same name doesn't already exist
            //for(var x=0; x<contracts.length; x++) {
            //    if(contract.name == contracts[x].name){
            //        throw 'A contract with this name already exists!';
            //    }
            //}

            //this is a new contract - set the external_id
            if (contracts.length > 0)
                contract.external_id = contracts[contracts.length - 1].external_id + 1;
            else
                contract.external_id = 1;

            contracts.push(contract);
            localStorage.removeItem('superCrow.contracts');
            localStorage.setItem('superCrow.contracts', JSON.stringify(contracts));
        };

        factory.getContract = function (external_id) {
            var contracts = factory.getContracts();

            for (var i = 0; i < contracts.length; i++) {
                if (contracts[i].external_id == external_id)
                    return contracts[i];
            }
        };

        factory.deleteContract = function (external_id) {
            var contracts = factory.getContracts();

            for (var i = 0; i < contracts.length; i++) {
                if (contracts[i].external_id == external_id) {
                    contracts.splice(i, 1);
                    localStorage.setItem('superCrow.contracts', JSON.stringify(contracts));
                }
            }
        };

        /*
         ORACLES - this is simply a list of ids that refer to contact ids
         */

        factory.getOracles = function () {
            return JSON.parse(localStorage.getItem('superCrow.oracles'));
        };

        factory.saveOracle = function (oracle) {
            var oracles = factory.getOracles();
            oracles.push(oracle);
            localStorage.removeItem('superCrow.oracles');
            localStorage.setItem('superCrow.oracles', JSON.stringify(oracles));
        };

        //factory.getOracle = function(id) {
        //    var oracles = self.getOracles();
        //
        //    for (var i = 0; i < oracles.length; i++) {
        //        if (oracles[i].id == id)
        //            return oracles[i];
        //    }
        //};

        factory.deleteOracle = function (id) {
            var oracles = factory.getOracles();

            for (var i = 0; i < oracles.length; i++) {
                if (oracles[i] == id) {
                    oracles.splice(i, 1);
                    localStorage.removeItem('superCrow.oracles');
                    localStorage.setItem('superCrow.oracles', JSON.stringify(oracles));
                }
            }
        };

        /*
         CONTACTS
         */

        factory.getContacts = function () {
            return JSON.parse(localStorage.getItem('superCrow.contacts'));
        };

        factory.saveContacts = function (contacts) {
            localStorage.removeItem('superCrow.contacts');
            return localStorage.setItem('superCrow.contacts', JSON.stringify(contacts));
        };

        factory.saveContact = function (contact) {
            var contacts = factory.getContacts();
            contacts.push(contact);
            localStorage.setItem('superCrow.contacts', JSON.stringify(contacts));
        };

        factory.getContact = function (id) {
            var contacts = factory.getContacts();

            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].id == id)
                    return contacts[i];
            }
        };

        factory.deleteContact = function (id) {
            var contacts = factory.getContacts();

            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].id == id) {
                    contacts.splice(i, 1);
                    self.saveContacts(contacts);
                }
            }
        };

        /*
         KEYS
         */

        factory.saveKeyPair = function (keyPair) {
            var currentPair = factory.getKeyPair();
            if (currentPair != null)
                factory.deleteKeyPair();

            localStorage.setItem('superCrow.keys', JSON.stringify(keyPair));
        };

        factory.getKeyPair = function () {
            return JSON.parse(localStorage.getItem('superCrow.keys'));
        };

        factory.deleteKeyPair = function () {
            localStorage.removeItem('superCrow.keys');
        };

        /*
         WALLET
         */
        factory.saveWallet = function (wallet) {
            var currentWallet = factory.getWallet();
            if (currentWallet != null)
                factory.deleteWallet();

            localStorage.setItem('superCrow.wallet', JSON.stringify(wallet));
        };

        factory.getWallet = function () {
            var wallet = localStorage.getItem('superCrow.wallet');
            if(wallet != null)
                return JSON.parse(wallet);
        };

        factory.deleteWallet = function () {
            localStorage.removeItem('superCrow.wallet');
        };

        /*
         SS_KEYS
         */
        factory.saveSsPair = function (ssPair) {
            var pairs = factory.getSsPairs();
            if (pairs == null)
                pairs = {};

            pairs[ssPair[0]] = ssPair[1];   //add a new pair to the pairs hash, with the first ss_key in the pair as the key
            factory.deleteSsPairs();
            localStorage.setItem('superCrow.ssKeys', JSON.stringify(pairs));
        };

        factory.saveSsPairs = function (ssPairs) {
            localStorage.setItem('superCrow.ssKeys', JSON.stringify(ssPairs));
        };

        factory.getSsPairs = function () {
            return JSON.parse(localStorage.getItem('superCrow.ssKeys'));
        };

        factory.deleteSsPair = function (ssPair) {
            var pairs = factory.getSsPairs();
            if (pairs[ssPair[0]] != null) {
                factory.deleteSsPairs();
                delete pairs[ssPair[0]];
            }

            factory.saveSsPairs(pairs);
        };

        factory.deleteSsPairs = function () {
            localStorage.removeItem('superCrow.ssKeys');
        };


        return factory;
    };

    localStorageFactory.$inject = injectParams;

    angular.module('superCrow').factory('localStorageService', localStorageFactory);

}());