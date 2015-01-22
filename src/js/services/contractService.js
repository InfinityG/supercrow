/**
 * Created by grant on 19/01/2015.
 */
(function () {

    var injectParams = ['$http', '$window', 'config', 'localStorageService'];

    var contractFactory = function ($http, $window, config, localStorageService) {

        var serviceBase = config.apiHost, factory = {};

        factory.getContracts = function () {
            return localStorageService.getContracts();
        };

        factory.saveContract = function (contract) {
            localStorageService.saveContract(contract);
        };

        factory.updateContract = function (contract) {
            localStorageService.getContract(contract.external_id);
            localStorageService.saveContract(contract);
        };

        factory.sendContract = function (contract) {
            return $http.post(serviceBase + '/contracts', contract, {'withCredentials': 'true'})
                .then(function (response) {
                    var data = response.data;
                    factory.saveContract(data);
                },
                function (error) {
                    $window.alert('An error occurred! Status:' + error.status + ', Message:' + JSON.stringify(error.data));
                });
        };

        factory.getContract = function (external_id) {
            return localStorageService.getContract(external_id);
        };

        factory.getContractTemplate = function (creatorPublicSigningKey, creatorWalletAddress, creatorSsKeyFragment) {
            return {
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
                                fragments: [creatorSsKeyFragment],
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
                                    "amount": 0,
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

        return factory;
    };

    contractFactory.$inject = injectParams;

    angular.module('superCrow').factory('contractService', contractFactory);

}());