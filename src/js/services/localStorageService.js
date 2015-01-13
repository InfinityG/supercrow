(function () {

    var localStorageFactory = function () {

        var factory = {};

        // CONTRACTS

        factory.getContracts = function () {
            var result = JSON.parse(localStorage.getItem('superCrow.contracts'));

            if(result == null)
                result = [];

            return result;
        };

        factory.saveContract = function(contract) {
            var contracts = factory.getContracts();
            contracts.push(contract);
            localStorage.removeItem('superCrow.contracts');
            localStorage.setItem('superCrow.contracts', JSON.stringify(contracts));
        };

        factory.getContract = function(id) {
            var contracts = factory.getContracts();

            for (var i = 0; i < contracts.length; i++) {
                if (contracts[i].id == id)
                    return contracts[i];
            }
        };

        factory.deleteContract = function(id) {
            var contracts = factory.getContracts();

            for (var i = 0; i < contracts.length; i++) {
                if (contracts[i].id == id) {
                    contracts.splice(i, 1);
                    localStorage.setItem('superCrow.contracts', JSON.stringify(contracts));
                }
            }
        };

        // ORACLES - this is simply a list of ids that refer to contact ids

        factory.getOracles = function(){
            return JSON.parse(localStorage.getItem('superCrow.oracles'));
        };

        factory.saveOracle = function(oracle){
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

        factory.deleteOracle = function(id){
            var oracles = factory.getOracles();

            for (var i = 0; i < oracles.length; i++) {
                if (oracles[i] == id) {
                    oracles.splice(i, 1);
                    localStorage.removeItem('superCrow.oracles');
                    localStorage.setItem('superCrow.oracles', JSON.stringify(oracles));
                }
            }
        };

        // CONTACTS

        factory.getContacts = function(){
            return JSON.parse(localStorage.getItem('superCrow.contacts'));
        };

        factory.saveContacts = function(contacts){
            localStorage.removeItem('superCrow.contacts');
            return localStorage.setItem('superCrow.contacts', JSON.stringify(contacts));
        };

        factory.saveContact = function(contact){
            var contacts = factory.getContacts();
            contacts.push(contact);
            localStorage.setItem('superCrow.contacts', JSON.stringify(contacts));
        };

        factory.getContact = function(id) {
            var contacts = factory.getContacts();

            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].id == id)
                    return contacts[i];
            }
        };

        factory.deleteContact = function(id){
            var contacts = factory.getContacts();

            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].id == id) {
                    contacts.splice(i, 1);
                    self.saveContacts(contacts);
                }
            }
        };

        return factory;
    };

    angular.module('superCrow').factory('localStorageService', localStorageFactory);

}());