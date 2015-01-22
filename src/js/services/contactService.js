/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', 'localStorageService'];

    var contactFactory = function ($http, localStorageService) {

        var factory = {};

        factory.getContacts= function() {
            var result = localStorageService.getContacts();

            if (result == null) {
                result = factory.getCannedContacts();
                localStorageService.saveContacts(result);
            }

            return result;
        };

        factory.getCannedContacts = function(){
            return [
                {
                    id: 1,
                    name: 'Shaun Conway',
                    email: 'shaun@resultslab.co',
                    publicKey: 'A14blB1UGo9SA/x0n0rIe0kOtW/27a2+ZAQu5t1L1mEr',
                    walletAddress: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn'
                },
                {
                    id: 2,
                    name: 'Sam Surka',
                    email: 'sam@resultslab.co',
                    publicKey: 'A14blB1UGo9SA/x0n0rIe0kOtW/27a2+ZAQu5t1L1mEr',
                    walletAddress: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn'
                },
                {
                    id: 3,
                    name: 'John Doe',
                    email: 'john@doe.me',
                    publicKey: 'A14blB1UGo9SA/x0n0rIe0kOtW/27a2+ZAQu5t1L1mEr',
                    walletAddress: 'rG1QQv2nh2gr7RCZ1P8YYcBUKCCN633jCn'
                }
            ];
        };

        return factory;
    };

    contactFactory.$inject = injectParams;

    angular.module('superCrow').factory('contactService', contactFactory);

}());