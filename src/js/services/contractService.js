/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', '$rootScope', 'config', 'localStorageService', 'sessionStorageService',
        'keyService', 'walletService'];

    var contractFactory = function ($http, $window, $rootScope, config, localStorageService, sessionStorageService,
                                    keyService, walletService) {

        var serviceBase = config.apiHost, factory = {};

        factory.getSavedContracts = function () {
            var contracts = localStorageService.getContracts();
            var context = sessionStorageService.getAuthToken();

            var savedContracts = [];

            for (var x = 0; x < contracts.length; x++) {
                if ((contracts[x].id == null || contracts[x].id == '') &&
                    context.user_id == contracts[x].user_id) {
                    savedContracts.push(contracts[x]);
                }
            }
            return savedContracts;
        };

        factory.getSubmittedContracts = function () {
            var contracts = localStorageService.getContracts();
            var context = sessionStorageService.getAuthToken();

            var submittedContracts = [];

            for (var x = 0; x < contracts.length; x++) {
                if ((contracts[x].id != null && contracts[x].id != '') &&
                    context.user_id == contracts[x].user_id) {
                    submittedContracts.push(contracts[x]);
                }
            }
            return submittedContracts;
        };

        factory.saveContract = function (contract) {
            localStorageService.saveContract(contract);
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' saved"
            });
        };

        factory.updateContract = function (contract) {
            localStorageService.getContract(contract.external_id);
            localStorageService.saveContract(contract);
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' updated'"
            });
        };

        factory.deleteContract = function (contract) {
            localStorageService.deleteContract(contract.external_id);
            $rootScope.$broadcast('contractEvent', {
                type: 'Success',
                status: 0,
                message: "Contract '" + contract.name + "' deleted"
            });
        };

        factory.sendContract = function (contract) {
            //generate a shared secret at the last minute and save it
            var sharedSecret = getSharedSecret();
            keyService.saveSsPair(sharedSecret);

            //add a shared secret fragment to the contract
            contract.participants[0].wallet.secret.fragments.push(sharedSecret[0]);

            //update the date to unix format
            setUnixDate(contract);

            return $http.post(serviceBase + '/contracts', contract)
                .then(function (response) {
                    localStorageService.saveContract(response.data);
                    $rootScope.$broadcast('contractEvent', {
                        type: 'Success',
                        status: response.status,
                        message: "Contract '" + contract.name + "' saved"
                    });
                });
        };

        factory.getContract = function (external_id) {
            var requestedContract = localStorageService.getContract(external_id);

            if (requestedContract != null) {
                return requestedContract;
            }

            $rootScope.$broadcast('contractEvent', {
                type: 'Error',
                status: 0,
                message: "Contract could not be found"
            });
        };

        factory.getContractTemplate = function () {
            var userId = sessionStorageService.getAuthToken().user_id;
            var creatorPublicSigningKey = keyService.getSigningKeyPair().pk;
            var creatorWalletAddress = walletService.getWallet().address;

            return {
                user_id: userId,
                external_id: 0,
                name: '',
                description: '',
                expires: '',
                participants: [
                    {
                        external_id: 1,
                        public_key: creatorPublicSigningKey,
                        roles: ['initiator', 'sender'],
                        wallet: {
                            address: creatorWalletAddress,
                            destination_tag: '',
                            secret: {
                                fragments: [],
                                threshold: 2
                            }
                        }
                    },
                    {
                        external_id: 2,
                        public_key: '',
                        roles: ['receiver'],
                        wallet: {
                            address: '',
                            destination_tag: '',
                            secret: null
                        }
                    },
                    {
                        external_id: 3,
                        public_key: '',
                        roles: ['oracle'],
                        wallet: {
                            address: '',
                            destination_tag: '',
                            secret: null
                        }
                    }
                ],
                conditions: [
                    {
                        name: '',
                        description: '',
                        expires: '',
                        sequence_number: 1,
                        signatures: [{
                            participant_external_id: 3,
                            type: 'ss_key',
                            delegated_by_external_id: 1
                        }],
                        trigger: {
                            transactions: [
                                {
                                    "from_participant_external_id": 1,
                                    "to_participant_external_id": 2,
                                    "amount": null,
                                    "currency": 'XRP'
                                }
                            ]
                        }
                    }
                ],
                signatures: [
                    {
                        participant_external_id: 1,
                        type: 'ecdsa',
                        value: '',
                        digest: ''
                    }
                ]
            };
        };

        function getSharedSecret() {
            var wallet = walletService.getWallet();
            return wallet != null ? keyService.getSplitWalletSecret(wallet) : null;
        }

        function setUnixDate(contract) {
            var dateArr = contract.expires.split('/');
            var unixExpiry = new Date(dateArr[2], dateArr[1], dateArr[0]).getTime() / 1000;
            contract.expires = unixExpiry;
            contract.conditions[0].expires = unixExpiry;
        }

        return factory;
    };

    contractFactory.$inject = injectParams;

    angular.module('superCrow').factory('contractService', contractFactory);

}());