(function () {

    var injectParams = ['$scope', 'localStorageService'];

    var ContractsController = function ($scope, localStorageService) {

        $scope.cannedReasons = ['Work Done', 'Goal Achieved', 'Goods Received', 'Recognition', 'Occasion/event'];

        $scope.cannedContacts = [
            {
                id: 1,
                name: 'Shaun Conway',
                email: 'shaun@resultslab.co',
                publicKey: ''
            },
            {
                id: 2,
                name: 'Sam Surka',
                email: 'sam@resultslab.co',
                publicKey: ''
            },
            {
                id: 3,
                name: 'Grant Pidwell',
                email: 'grantpidwell@infinity-g.com',
                publicKey: ''
            }
        ];
        $scope.contacts = null;
        $scope.currentReceiver = null;

        $scope.oracles = null;
        $scope.currentOracle = null;

        $scope.contracts = null;
        $scope.selectedContract = null;
        $scope.currentContract = null;
        $scope.newContract = {
            name: '',
            description: '',
            expires: '',
            participants: [
                {
                    external_id: 1,
                    public_key: '',
                    roles: ['creator', 'sender'],
                    wallet: {
                        address: '',
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
                    wallet: null
                }
            ],
            conditions: [
                {
                    name: '',
                    description: '',
                    expires: '',
                    sequence_number: 1,
                    signatures: {
                        participant_external_id: 3,
                        type: 'ss_key',
                        delegated_by_external_id: 1
                    },
                    trigger: {
                        transactions: [
                            {
                                "from_participant_external_id": 1,
                                "to_participant_external_id": 2,
                                "amount": 0,
                                "currency": ''
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

        function init() {
            $scope.contracts = getContracts();
            $scope.currentContract = $scope.newContract;

            //
            //if ($scope.contracts != null && $scope.contracts.length > 0)
            //    $scope.currentContract = $scope.contracts[0];

            //$scope.oracles = getOracles();
            $scope.contacts = getContacts();
        }

        function getContracts() {
            return localStorageService.getContracts();
        }

        function saveContract(contract) {
            localStorageService.saveContract(contract);
        }

        function getContract(id) {
            return localStorageService.getContract(id);
        }

        function deleteContract(id) {
            localStorageService.deleteContract(id);
        }

        function getContact(id) {
            for (var i = 0; i < $scope.contacts.length; i++) {
                if ($scope.contacts[i].id == id)
                    return $scope.contacts[id];
            }
        }

        function getContacts() {
            var result = localStorageService.getContacts();

            if (result == null) {
                localStorageService.saveContacts($scope.cannedContacts);
                result = localStorageService.getContacts();
            }

            return result;
        }

        function getOracles() {
            var oracleIds = localStorageService.getOracles();
            var result = [];

            for(var i=0; i<oracleIds.length; i++){
                var contacts = $scope.getContacts();
                for(var x=0; x<contacts.length; x++){
                    if(contacts[x].id == oracleIds[i])
                    result.push(contacts[x]);
                }
            }

            return result;
        }

        $scope.oracleSelected = function (oracle) {
            $scope.currentOracle = oracle;
            $scope.currentContract.participants[2].external_id = oracle.id;
        };

        $scope.reasonSelected = function (reason) {
            $scope.currentContract.conditions[0].name = reason;
            $scope.currentContract.conditions[0].description = reason;
        };

        $scope.contractSelected = function (id) {
            $scope.selectedContract = localStorageService.getContract(id);
        };

        $scope.receiverSelected = function (contact) {
            $scope.currentReceiver = contact;
            $scope.currentContract.participants[1].wallet.address = contact.publicKey;
        };

        $scope.saveContract = function(){
            saveContract($scope.currentContract);
        };

        init();
    };

    ContractsController.$inject = injectParams;

    angular.module('superCrow').controller('ContractsController', ContractsController);

}());